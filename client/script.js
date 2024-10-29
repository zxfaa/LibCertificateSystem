function selectIdType(type) {
    document.getElementById('selectedIdType').value = type;
}

function selectIdentityType(type) {
    document.getElementById('selectedIdentityType').value = type;
}

async function queryVisitor() {
    let visitorId = document.getElementById('id').value.trim();

    // 將第一個字母轉為大寫並重新組合 ID
    visitorId = visitorId.charAt(0).toUpperCase() + visitorId.slice(1);

    // 設定回 ID 欄位，以防輸入的是小寫
    document.getElementById('id').value = visitorId;

    // 檢查是否為一位字母加九位數字的格式
    const idRegex = /^[A-Z][0-9]{9}$/;
    if (!idRegex.test(visitorId)) {
        alert('身份證字號格式不正確！請輸入一位字母加九位數字的組合。');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/visitors/check-visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: visitorId })
        });

        const data = await response.json(); // 無論成功與否都先解析 JSON

        if (data.exists) {
            // 將返回的資料填入到對應的欄位中
            const visitor = data.visitor;
            if (visitor.is_entered) {
                document.getElementById('name').value = visitor.name;
                document.getElementById('phone').value = visitor.phone;
                document.getElementById('selectedIdType').value = visitor.id_type;
                document.getElementById('selectedIdentityType').value = visitor.identity_type;
                document.getElementById('entryTime').value = visitor.entry_time ? new Date(visitor.entry_time).toLocaleString() : '';
                document.getElementById('exitTime').value = visitor.exit_time ? new Date(visitor.exit_time).toLocaleString() : '';

            } else {
                // 若未進館，填入 name、phone 和 ID
                document.getElementById('name').value = visitor.name;
                document.getElementById('phone').value = visitor.phone;
                document.getElementById('id').value = visitorId; // 設置 ID
                // 可選：清空其他欄位或進行其他操作
                document.getElementById('selectedIdType').value = '';
                document.getElementById('selectedIdentityType').value = '';
                document.getElementById('entryTime').value = '';
                document.getElementById('exitTime').value = '';
            }

        } else {
            // 訪客不存在時打開模態框
            document.getElementById('rulesModal').style.display = 'block';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('查詢時發生錯誤，請稍後再試。');
    }
}

async function addVisitor() {
    // 獲取輸入欄位中的值
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // 檢查欄位是否為空
    if (!id || !name || !phone) {
        alert('請填寫完整的訪客資料');
        return;
    }

    try {
        // 發送新增訪客的請求
        const response = await fetch('http://localhost:3000/api/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, phone }) // 將訪客資料轉為 JSON
        });

        if (response.ok) {
            const newVisitor = await response.json();
            alert('訪客已成功新增！');
        } else {
            const errorData = await response.json();
            alert(`新增失敗: ${errorData.error}`);
        }
    } catch (error) {
        console.error('發送新增訪客請求時發生錯誤:', error);
        alert('新增訪客時發生錯誤，請稍後再試。');
    }
}
async function fetchReplacementNumber(identityType) {
    try {
        const response = await fetch(`http://localhost:3000/api/visitors/certificate-replacement-number`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identityType })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('certificateReplacementNumber').value = data.nextId;
        } else {
            alert('獲取換證編號時發生錯誤，請稍後再試。');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('查詢時發生錯誤，請稍後再試。');
    }
}

// 在每個按鈕上更新 onclick 事件
document.querySelectorAll('.identity-button').forEach(button => {
    button.addEventListener('click', () => {
        const type = button.innerText;  // 或者用你目前的判定邏輯
        fetchReplacementNumber(type);
    });
});

async function markEntry() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const idType = document.getElementById('selectedIdType').value;
    const identityType = document.getElementById('selectedIdentityType').value;
    const visitor_id = document.getElementById('certificateReplacementNumber').value;

    try {
        const response = await fetch('http://localhost:3000/api/visitors/mark-entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                name: name,
                phone: phone,
                id_type: idType,
                identity_type: identityType,
                visitor_id: visitor_id,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // 清除欄位或進行其他操作
        } else {
            alert('進館失敗: ' + data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('進館時發生錯誤，請稍後再試。');
    }
    location.reload();
}
function acceptAndClose() {
    // 在這裡可以添加接受後的邏輯
    closeModal();
}

function rejectAndClose() {
    // 重新載入網頁
    location.reload();
}

function closeModal() {
    document.getElementById('rulesModal').style.display = 'none'; // 隱藏模態框
}


