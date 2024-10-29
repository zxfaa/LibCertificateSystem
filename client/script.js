function selectIdType(type) {
    document.getElementById('selectedIdType').value = type;
}

function selectIdentityType(type) {
    document.getElementById('selectedIdentityType').value = type;
}

function queryVisitor() {
    const id = document.getElementById('id').value;

    fetch('/api/visitors/check-visitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // 傳遞訪客的ID
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // 解析回應的JSON
    })
    .then(data => {
        if (data.exists) {
            // 填入資料到頁面
            const visitor = data.visitor;
            document.getElementById('name').value = visitor.name || ''; // 姓名
            document.getElementById('phone').value = visitor.phone || ''; // 電話
            document.getElementById('selectedIdType').value = visitor.id_type || ''; // 證件
            document.getElementById('selectedIdentityType').value = visitor.identity_type || ''; // 身份
            document.getElementById('entryTime').value = visitor.entry_time ? new Date(visitor.entry_time).toLocaleString() : ''; // 進館時間
            document.getElementById('exitTime').value = visitor.exit_time ? new Date(visitor.exit_time).toLocaleString() : ''; // 離館時間
        } else {
            alert('未找到資料'); // 提示未找到資料
        }
    })
    .catch(error => {
        console.error('Fetch error:', error); // 錯誤處理
    });
}
