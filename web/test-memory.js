// 测试记忆功能的脚本
async function testMemoryFeature() {
    const baseUrl = 'http://localhost:3000/api/copilot/query';
    
    // 模拟对话历史
    const conversationHistory = [
        { role: 'user', content: 'FA506能连吗？' },
        { role: 'assistant', content: '支持直连，通过Modbus协议连接。' },
        { role: 'user', content: '数据采集频率是多少？' },
        { role: 'assistant', content: '默认1秒，可配置到10秒。' },
        { role: 'user', content: '连接方式稳定吗？' }, // 这个应该触发记忆
    ];
    
    const testCases = [
        {
            name: '时间指代测试',
            query: '刚才那个连接方式稳定吗？',
            shouldTrigger: true
        },
        {
            name: '代词指代测试', 
            query: '它支持多少设备？',
            shouldTrigger: true
        },
        {
            name: '无触发词测试',
            query: '系统有哪些功能？',
            shouldTrigger: false
        },
        {
            name: '原理问题测试',
            query: '为什么能实现实时监控？',
            shouldTrigger: true
        }
    ];
    
    console.log('开始测试记忆功能...\n');
    
    for (const testCase of testCases) {
        console.log(`\n=== ${testCase.name} ===`);
        console.log(`问题: ${testCase.query}`);
        console.log(`预期触发记忆: ${testCase.shouldTrigger}`);
        
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: testCase.query,
                    conversationHistory: conversationHistory
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 请求成功');
                console.log(`意图: ${data.intent}`);
                console.log(`置信度: ${data.confidence}`);
                
                if (data.memory) {
                    console.log('✅ 记忆已加载');
                    console.log(`记忆来源: ${data.memory.source}`);
                    console.log(`记忆tokens: ${data.memory.tokens}`);
                    console.log(`记忆内容预览: ${data.memory.source === 'compressed' ? '[已压缩]' : '[未压缩]'}`);
                } else {
                    console.log('⚪ 未加载记忆');
                }
                
                console.log(`回答预览: ${data.message.substring(0, 100)}...`);
            } else {
                console.log('❌ 请求失败');
            }
        } catch (error) {
            console.log('❌ 错误:', error.message);
        }
    }
    
    console.log('\n测试完成！');
}

// 运行测试
testMemoryFeature();
