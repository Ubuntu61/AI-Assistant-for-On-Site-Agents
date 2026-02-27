import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the same service role key as the main app to access CRM data from this standalone API
const SUPABASE_URL = process.env.COPILOT_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.COPILOT_SUPABASE_KEY || "";

// Verify we have credentials
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("CRM Supabase keys missing. CRM context will likely fail.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = [];

        // Use an unaccent/case-insensitive ilike search if possible,
        // or just basic ilike for names.
        const searchTerm = `%${query}%`;

        // 1. Search Companies
        const { data: companies, error: compErr } = await supabase
            .from("companies")
            .select("id, name, sector, size, description")
            .ilike("name", searchTerm)
            .limit(3);

        if (!compErr && companies) {
            companies.forEach(c => {
                results.push({
                    type: "company",
                    id: c.id,
                    name: c.name,
                    details: `行业: ${c.sector || '未知'}, 规模: ${c.size || '未知'}. ${c.description ? '简介: ' + c.description : ''}`
                });
            });
        }

        // 2. Search Contacts
        const { data: contacts, error: contErr } = await supabase
            .from("contacts")
            .select("id, first_name, last_name, title, company_id")
            // A simple combined ilike might require a raw query or computed column, 
            // but for simplicity we search by last_name or first_name
            .or(`last_name.ilike.${searchTerm},first_name.ilike.${searchTerm}`)
            .limit(3);

        if (!contErr && contacts) {
            contacts.forEach(c => {
                const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ");
                results.push({
                    type: "contact",
                    id: c.id,
                    name: fullName,
                    details: `头衔/职位: ${c.title || '未知'}`
                });
            });
        }

        // 3. Search Deals
        const { data: deals, error: dealErr } = await supabase
            .from("deals")
            .select("id, name, stage, amount")
            .ilike("name", searchTerm)
            .limit(3);

        if (!dealErr && deals) {
            deals.forEach(d => {
                results.push({
                    type: "deal",
                    id: d.id,
                    name: d.name,
                    details: `阶段: ${d.stage || '未知'}, 金额: ${d.amount ? '$' + d.amount : '未知'}`
                });
            });
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error("[crm-search] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
