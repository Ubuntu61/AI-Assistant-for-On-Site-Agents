import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();

        // Validate required fields
        const requiredFields = [
            "companyName",
            "contactName",
            "contactPhone",
        ] as const;
        for (const field of requiredFields) {
            if (!formData?.[field]) {
                return NextResponse.json(
                    { error: `缺少必填字段: ${field}` },
                    { status: 400 },
                );
            }
        }

        const supabase = createSupabaseAdmin();

        // Map incoming camelCase form fields to snake_case DB columns
        const payload = {
            company_name: String(formData.companyName),
            contact_name: String(formData.contactName),
            contact_phone: String(formData.contactPhone),
            contact_email: formData.contactEmail
                ? String(formData.contactEmail)
                : "",

            // Equipment info
            equipment_models: formData.equipmentModels
                ? String(formData.equipmentModels)
                : "",
            equipment_age: formData.equipmentAge
                ? String(formData.equipmentAge)
                : "",
            has_data_interface: Boolean(formData.hasDataInterface),
            automation_level: formData.automationLevel
                ? String(formData.automationLevel)
                : "",

            // Network status
            is_networked: Boolean(formData.isNetworked),
            network_type: formData.networkType
                ? String(formData.networkType)
                : "",
            existing_collection_system: formData.existingCollectionSystem
                ? String(formData.existingCollectionSystem)
                : "",
            collection_coverage: formData.collectionCoverage
                ? String(formData.collectionCoverage)
                : "",

            // Pain points
            manual_statistics: formData.manualStatistics
                ? String(formData.manualStatistics)
                : "",
            production_bottleneck: formData.productionBottleneck
                ? String(formData.productionBottleneck)
                : "",
            management_issues: formData.managementIssues
                ? String(formData.managementIssues)
                : "",

            // Customization needs
            erp_integration: Boolean(formData.erpIntegration),
            mobile_app_needed: Boolean(formData.mobileAppNeeded),
            custom_reports: Boolean(formData.customReports),
            process_encryption: Boolean(formData.processEncryption),
            ai_equipment_integration: Boolean(formData.aiEquipmentIntegration),
            other_requirements: formData.otherRequirements
                ? String(formData.otherRequirements)
                : "",

            // Budget
            budget_range: formData.budgetRange
                ? String(formData.budgetRange)
                : "",
            purchase_timeline: formData.purchaseTimeline
                ? String(formData.purchaseTimeline)
                : "",
            decision_process: formData.decisionProcess
                ? String(formData.decisionProcess)
                : "",
        };

        const { data, error } = await supabase
            .from("surveys")
            .insert(payload)
            .select("id")
            .single();

        if (error) {
            console.error("[v0] Supabase insert error:", error);
            return NextResponse.json(
                { error: "提交失败，请稍后再试" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "问卷提交成功！我们会尽快与您联系。",
            id: data?.id,
        });
    } catch (error) {
        console.error("[v0] Survey submission error:", error);
        return NextResponse.json(
            { error: "服务器错误，请稍后再试" },
            { status: 500 },
        );
    }
}
