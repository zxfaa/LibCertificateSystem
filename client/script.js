let selectedIdType = '';
let selectedIdentityType = '';

function selectIdType(type) {
    selectedIdType = type;
    alert(`已選擇證件: ${type}`);
}

function selectIdentityType(type) {
    selectedIdentityType = type;
    alert(`已選擇身分: ${type}`);
}

function markEntry() {
    const entryTime = new Date().toLocaleString();
    document.getElementById("entryTime").value = entryTime;
    alert(`進館時間已記錄: ${entryTime}`);
}

function markExit() {
    const exitTime = new Date().toLocaleString();
    document.getElementById("exitTime").value = exitTime;
    alert(`離館時間已記錄: ${exitTime}`);
}
