async function searchVisitor() {
    const visitorId = document.getElementById('id').value.trim();

    try {
        const response = await fetch(`http://localhost:3000/api/visitors/check-visitor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: visitorId })
        });

        const data = await response.json();

        if (data.exists) {
            const visitor = data.visitor;
            const certificateReplacementNumber = data.certificateReplacementNumber;

            // 將訪客資料回填到對應的欄位中
            document.getElementById('id').value = visitor.id || '';
            document.getElementById('name').value = visitor.name || '';
            document.getElementById('phone').value = visitor.phone || '';
            document.getElementById('identity').value = visitor.identity_type || '';
            document.getElementById('idType').value = visitor.id_type || '';
            document.getElementById('exchangeNumber').value = certificateReplacementNumber || '';
            document.getElementById('isEnter').value = visitor.is_entered ? 'true' : 'false';  // 更新為下拉選單
            document.getElementById('entryTime').value = visitor.entry_time ? new Date(visitor.entry_time).toISOString().slice(0, 16) : '';
            document.getElementById('exitTime').value = visitor.exit_time ? new Date(visitor.exit_time).toISOString().slice(0, 16) : '';
            document.getElementById('ban').value = visitor.ban ? 'true' : 'false';
            document.getElementById('remarks').value = visitor.remarks || '';
        } else {
            // 若查無資料，保持欄位空值
            document.getElementById('id').value = '';  // 清空ID欄位
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('identity').value = '';
            document.getElementById('idType').value = '';
            document.getElementById('exchangeNumber').value = '';
            document.getElementById('isEnter').value = 'false';  // 沒有資料時顯示「否」
            document.getElementById('entryTime').value = '';
            document.getElementById('exitTime').value = '';
            document.getElementById('ban').value = 'false';
            document.getElementById('remarks').value = '';
        }
    } catch (error) {
        console.error('查詢訪客資料時發生錯誤:', error);
        alert('查詢時發生錯誤，請稍後再試。');
    }
}


async function updateVisitor() {
    const visitorData = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        identity: document.getElementById('identity').value,
        idType: document.getElementById('idType').value,
        exchangeNumber: document.getElementById('exchangeNumber').value,
        isEnter: document.getElementById('isEnter').value === 'true',  // 將選擇轉為布林值
        entryTime: document.getElementById('entryTime').value,
        exitTime: document.getElementById('exitTime').value,
        ban: document.getElementById('ban').value,
        remarks: document.getElementById('remarks').value,
    };

    try {
        const response = await fetch('http://localhost:3000/api/visitors/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`更新失敗: ${errorData.message}`);
        } else {
            alert('訪客資料更新成功');
            location.reload();
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert('更新過程中發生錯誤');
    }
}



function resetForm() {
    document.getElementById('visitorForm').reset();
}