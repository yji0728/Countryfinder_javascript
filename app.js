// IP 국가 조회 앱 - 메인 로직

let resultsData = [];

// API 객체 (외부에서 사용 가능)
const CountryFinderAPI = {
    lookup: function(ip) {
        return IPDatabase.lookup(ip);
    },
    
    lookupBulk: function(ips) {
        return ips.map(ip => IPDatabase.lookup(ip.trim())).filter(r => r !== null);
    }
};

// 전역 객체로 노출 (Excel VBA 등에서 접근 가능)
window.CountryFinderAPI = CountryFinderAPI;

// IP 조회 메인 함수
function lookupIPs() {
    const input = document.getElementById('ipInput').value;
    const messageDiv = document.getElementById('message');
    
    // 입력 검증
    if (!input.trim()) {
        showMessage('IP 주소를 입력해주세요.', 'error');
        return;
    }
    
    // IP 목록 파싱 (줄바꿈, 쉼표, 공백 등으로 구분)
    const ips = input
        .split(/[\n,;\s]+/)
        .map(ip => ip.trim())
        .filter(ip => ip.length > 0);
    
    if (ips.length === 0) {
        showMessage('유효한 IP 주소를 입력해주세요.', 'error');
        return;
    }
    
    // 조회 시작
    showMessage('조회 중...', 'loading');
    
    // 약간의 지연 후 조회 (UI 업데이트를 위해)
    setTimeout(() => {
        resultsData = [];
        
        ips.forEach(ip => {
            const result = IPDatabase.lookup(ip);
            resultsData.push(result);
        });
        
        displayResults();
        showMessage(`총 ${resultsData.length}개의 IP 주소를 조회했습니다.`, 'success');
        
        // 통계 업데이트
        updateStats();
    }, 100);
}

// 결과 표시
function displayResults() {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    
    if (resultsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #999; padding: 40px;">
                    조회된 결과가 없습니다.
                </td>
            </tr>
        `;
        return;
    }
    
    resultsData.forEach((result, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${result.ip}</td>
            <td>${result.country}</td>
            <td>${result.code}</td>
            <td>${result.continent}</td>
        `;
        tbody.appendChild(row);
    });
}

// 통계 업데이트
function updateStats() {
    const statsDiv = document.getElementById('stats');
    const totalIPs = resultsData.length;
    
    // 국가별 집계
    const countryCounts = {};
    resultsData.forEach(result => {
        const country = result.country;
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    const uniqueCountries = Object.keys(countryCounts).length;
    statsDiv.textContent = `총 ${totalIPs}개 IP | ${uniqueCountries}개 국가`;
}

// 전체 선택/해제
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// 선택된 행 가져오기
function getSelectedRows() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    
    // 선택이 없으면 전체 반환
    if (selectedIndices.length === 0) {
        return resultsData;
    }
    
    return selectedIndices.map(index => resultsData[index]);
}

// 선택된 컬럼 가져오기
function getSelectedColumns() {
    return {
        ip: document.getElementById('col-ip').checked,
        country: document.getElementById('col-country').checked,
        code: document.getElementById('col-code').checked,
        continent: document.getElementById('col-continent').checked
    };
}

// 클립보드에 복사
function copyToClipboard() {
    if (resultsData.length === 0) {
        showMessage('조회 결과가 없습니다.', 'error');
        return;
    }
    
    const selectedRows = getSelectedRows();
    const selectedCols = getSelectedColumns();
    
    // 헤더 생성
    const headers = [];
    if (selectedCols.ip) headers.push('IP 주소');
    if (selectedCols.country) headers.push('국가명 (한글)');
    if (selectedCols.code) headers.push('국가코드');
    if (selectedCols.continent) headers.push('대륙');
    
    // 데이터 생성
    const rows = [headers.join('\t')];
    selectedRows.forEach(result => {
        const row = [];
        if (selectedCols.ip) row.push(result.ip);
        if (selectedCols.country) row.push(result.country);
        if (selectedCols.code) row.push(result.code);
        if (selectedCols.continent) row.push(result.continent);
        rows.push(row.join('\t'));
    });
    
    const text = rows.join('\n');
    
    // 클립보드에 복사
    navigator.clipboard.writeText(text).then(() => {
        showMessage(`${selectedRows.length}개의 행을 클립보드에 복사했습니다. Excel에 붙여넣기 가능합니다.`, 'success');
    }).catch(err => {
        // 폴백: textarea 사용
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showMessage(`${selectedRows.length}개의 행을 클립보드에 복사했습니다.`, 'success');
    });
}

// CSV로 내보내기
function exportToCSV() {
    if (resultsData.length === 0) {
        showMessage('조회 결과가 없습니다.', 'error');
        return;
    }
    
    const selectedRows = getSelectedRows();
    const selectedCols = getSelectedColumns();
    
    // UTF-8 BOM 추가 (Excel에서 한글 제대로 표시)
    const BOM = '\uFEFF';
    
    // 헤더 생성
    const headers = [];
    if (selectedCols.ip) headers.push('IP 주소');
    if (selectedCols.country) headers.push('국가명 (한글)');
    if (selectedCols.code) headers.push('국가코드');
    if (selectedCols.continent) headers.push('대륙');
    
    // CSV 데이터 생성
    const rows = [headers.join(',')];
    selectedRows.forEach(result => {
        const row = [];
        if (selectedCols.ip) row.push(`"${result.ip}"`);
        if (selectedCols.country) row.push(`"${result.country}"`);
        if (selectedCols.code) row.push(`"${result.code}"`);
        if (selectedCols.continent) row.push(`"${result.continent}"`);
        rows.push(row.join(','));
    });
    
    const csvContent = BOM + rows.join('\n');
    
    // 파일 다운로드
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.setAttribute('href', url);
    link.setAttribute('download', `ip_country_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage(`${selectedRows.length}개의 행을 CSV 파일로 내보냈습니다.`, 'success');
}

// 초기화
function clearResults() {
    document.getElementById('ipInput').value = '';
    resultsData = [];
    displayResults();
    document.getElementById('stats').textContent = '';
    document.getElementById('message').innerHTML = '';
    document.getElementById('selectAll').checked = false;
}

// 메시지 표시
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    
    let className = '';
    if (type === 'error') className = 'error';
    else if (type === 'success') className = 'success';
    else if (type === 'loading') className = 'loading';
    
    messageDiv.innerHTML = `<div class="${className}">${message}</div>`;
    
    // 성공/에러 메시지는 5초 후 자동으로 사라짐
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 샘플 IP 주소 (선택사항)
    // document.getElementById('ipInput').value = '8.8.8.8\n1.1.1.1\n208.67.222.222';
});

// Enter 키로 조회
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ipInput').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            lookupIPs();
        }
    });
});
