# 사용자 가이드 (User Guide)

## IP 국가 조회기 - 상세 사용 설명서

### 1. 파일 구조
```
Countryfinder_javascript/
├── index.html      # 메인 HTML 파일 (웹 인터페이스)
├── app.js          # 애플리케이션 로직
├── ip-database.js  # IP-국가 매핑 데이터베이스
├── README.md       # 프로젝트 설명
└── .gitignore      # Git 제외 파일 목록
```

### 2. 설치 및 실행

#### 방법 1: 직접 실행 (가장 간단)
1. `index.html` 파일을 더블 클릭하여 웹 브라우저에서 엽니다
2. 바로 사용 가능합니다!

#### 방법 2: 웹 서버를 통한 실행
```bash
# Python 웹 서버 사용
python -m http.server 8080

# 브라우저에서 http://localhost:8080/index.html 열기
```

### 3. 기능 상세 설명

#### 3.1 IP 주소 입력
- **단일 IP**: 한 줄에 하나씩 입력
- **대량 IP**: 여러 줄에 걸쳐 입력
- **구분자**: 줄바꿈, 쉼표, 세미콜론, 공백 모두 지원
- **예시**:
  ```
  8.8.8.8
  1.1.1.1, 2.0.0.1
  117.5.5.5; 61.10.20.30
  ```

#### 3.2 조회하기 (🔍 버튼)
- IP 주소를 조회하여 결과 테이블에 표시
- 결과: IP 주소, 국가명(한글), 국가코드, 대륙
- 통계: 총 IP 개수 및 국가 수 표시

#### 3.3 복사하기 (📋 버튼)
- 선택된 행의 데이터를 클립보드에 복사
- Excel 호환 형식 (탭으로 구분)
- 선택 방법:
  - 개별 행 선택: 각 행의 체크박스 클릭
  - 전체 선택: 헤더의 체크박스 클릭
  - 선택 없음: 자동으로 전체 복사

#### 3.4 CSV 내보내기 (📥 버튼)
- 결과를 CSV 파일로 저장
- 파일명: `ip_country_YYYY-MM-DD-HHmmss.csv`
- UTF-8 BOM 포함 (Excel에서 한글 정상 표시)
- Excel, Google Sheets 등에서 열기 가능

#### 3.5 컬럼 선택
- 내보낼 데이터 컬럼 선택:
  - ☑ IP 주소
  - ☑ 국가명 (한글)
  - ☑ 국가코드
  - ☑ 대륙
- 복사/내보내기 시 선택된 컬럼만 포함

#### 3.6 초기화 (🗑️ 버튼)
- 입력 필드 및 결과 테이블 초기화
- 새로운 조회 시작 시 사용

### 4. Excel에서 사용하기

#### 4.1 복사-붙여넣기 방식
1. IP 국가 조회기에서 조회 완료
2. "📋 복사하기" 버튼 클릭
3. Excel 열기
4. 원하는 셀 선택
5. `Ctrl+V` (또는 `Cmd+V`) 붙여넣기

#### 4.2 CSV 파일 가져오기
1. IP 국가 조회기에서 "📥 CSV 내보내기" 클릭
2. Excel에서 "파일 > 열기" 선택
3. 다운로드된 CSV 파일 열기

#### 4.3 Excel VBA 사용
```vba
Sub LookupIPCountry()
    Dim IE As Object
    Dim htmlDoc As Object
    Dim result As String
    Dim ip As String
    
    ' IP 주소 가져오기 (A1 셀)
    ip = Range("A1").Value
    
    ' Internet Explorer 객체 생성
    Set IE = CreateObject("InternetExplorer.Application")
    IE.Visible = False
    
    ' HTML 파일 로드
    IE.Navigate "file:///C:/path/to/index.html"
    
    ' 페이지 로드 대기
    Do While IE.Busy Or IE.readyState <> 4
        DoEvents
    Loop
    
    ' JavaScript API 호출
    Set htmlDoc = IE.Document
    result = htmlDoc.parentWindow.CountryFinderAPI.lookup(ip).country
    
    ' 결과를 B1 셀에 입력
    Range("B1").Value = result
    
    ' 정리
    IE.Quit
    Set IE = Nothing
End Sub
```

### 5. JavaScript API 사용

#### 5.1 기본 사용법
```javascript
// 페이지에 JavaScript 파일 로드 후
// 전역 객체 CountryFinderAPI 사용 가능

// 단일 IP 조회
const result = CountryFinderAPI.lookup('8.8.8.8');
console.log(result);
// 출력:
// {
//   ip: '8.8.8.8',
//   country: '미국',
//   code: 'US',
//   continent: '북아메리카'
// }
```

#### 5.2 대량 조회
```javascript
const ips = [
    '8.8.8.8',
    '1.1.1.1',
    '117.5.5.5',
    '43.100.50.25'
];

const results = CountryFinderAPI.lookupBulk(ips);

results.forEach(result => {
    console.log(`${result.ip} -> ${result.country} (${result.code})`);
});
```

#### 5.3 에러 처리
```javascript
const result = CountryFinderAPI.lookup('invalid.ip.address');

if (result.error) {
    console.error(`Error: ${result.error}`);
    console.log(`IP: ${result.ip} is invalid`);
} else {
    console.log(`Country: ${result.country}`);
}
```

### 6. 다른 웹 애플리케이션에서 통합

#### 6.1 iframe 사용
```html
<iframe 
    src="index.html" 
    width="100%" 
    height="600px"
    frameborder="0">
</iframe>

<script>
    // iframe 내의 API 접근
    const iframe = document.querySelector('iframe');
    iframe.onload = function() {
        const api = iframe.contentWindow.CountryFinderAPI;
        const result = api.lookup('8.8.8.8');
        console.log(result);
    };
</script>
```

#### 6.2 스크립트 직접 로드
```html
<script src="ip-database.js"></script>
<script src="app.js"></script>

<script>
    // 바로 사용 가능
    const result = CountryFinderAPI.lookup('8.8.8.8');
    document.getElementById('result').textContent = result.country;
</script>
```

### 7. 지원 국가 목록

#### 아시아
- 🇰🇷 대한민국 (KR)
- 🇯🇵 일본 (JP)
- 🇨🇳 중국 (CN)
- 🇮🇳 인도 (IN)
- 🇸🇬 싱가포르 (SG)
- 🇹🇼 대만 (TW)
- 🇭🇰 홍콩 (HK)
- 🇹🇭 태국 (TH)
- 🇲🇾 말레이시아 (MY)
- 🇮🇩 인도네시아 (ID)
- 🇻🇳 베트남 (VN)
- 🇵🇭 필리핀 (PH)
- 🇮🇱 이스라엘 (IL)
- 🇸🇦 사우디아라비아 (SA)
- 🇦🇪 아랍에미리트 (AE)
- 🇹🇷 튀르키예 (TR)

#### 북아메리카
- 🇺🇸 미국 (US)
- 🇨🇦 캐나다 (CA)
- 🇲🇽 멕시코 (MX)

#### 유럽
- 🇬🇧 영국 (GB)
- 🇩🇪 독일 (DE)
- 🇫🇷 프랑스 (FR)
- 🇮🇹 이탈리아 (IT)
- 🇪🇸 스페인 (ES)
- 🇳🇱 네덜란드 (NL)
- 🇸🇪 스웨덴 (SE)
- 🇨🇭 스위스 (CH)
- 🇵🇱 폴란드 (PL)
- 🇧🇪 벨기에 (BE)
- 🇦🇹 오스트리아 (AT)
- 🇳🇴 노르웨이 (NO)
- 🇩🇰 덴마크 (DK)
- 🇫🇮 핀란드 (FI)
- 🇮🇪 아일랜드 (IE)
- 🇵🇹 포르투갈 (PT)
- 🇬🇷 그리스 (GR)
- 🇨🇿 체코 (CZ)
- 🇷🇺 러시아 (RU)
- 🇺🇦 우크라이나 (UA)
- 🇷🇴 루마니아 (RO)
- 🇭🇺 헝가리 (HU)

#### 오세아니아
- 🇦🇺 호주 (AU)
- 🇳🇿 뉴질랜드 (NZ)

#### 남아메리카
- 🇧🇷 브라질 (BR)
- 🇦🇷 아르헨티나 (AR)
- 🇨🇱 칠레 (CL)
- 🇨🇴 콜롬비아 (CO)
- 🇵🇪 페루 (PE)

#### 아프리카
- 🇿🇦 남아프리카공화국 (ZA)
- 🇪🇬 이집트 (EG)

### 8. 문제 해결

#### 8.1 결과가 "기타/국제"로 표시되는 경우
- 해당 IP 범위가 데이터베이스에 없는 경우
- 개인 IP 주소 (192.168.x.x, 10.x.x.x 등)
- 예약된 IP 주소 범위

#### 8.2 한글이 깨지는 경우 (CSV)
- Excel 2016 이상 사용 권장
- CSV 파일을 "가져오기" 기능으로 열기
- UTF-8 인코딩 선택

#### 8.3 복사 기능이 작동하지 않는 경우
- 최신 브라우저 사용 (Chrome, Edge, Firefox 권장)
- 브라우저의 클립보드 권한 확인
- HTTPS 또는 로컬 파일로 실행

### 9. 성능 최적화

- **대량 조회**: 수천 개의 IP도 빠르게 처리
- **메모리 효율**: 모든 데이터가 로컬에 저장되어 네트워크 불필요
- **빠른 검색**: IP 범위 기반 이진 검색 알고리즘

### 10. 업데이트 및 유지보수

#### IP 데이터베이스 업데이트
`ip-database.js` 파일의 `ranges` 배열에 새로운 IP 범위 추가:

```javascript
{ start: IP_START_NUM, end: IP_END_NUM, code: 'COUNTRY_CODE' }
```

IP 주소를 숫자로 변환:
```javascript
// 예: 192.168.1.0 = 192*256³ + 168*256² + 1*256 + 0
```

### 11. 라이선스
MIT License

### 12. 지원 및 문의
GitHub Issues를 통해 문의 및 제안 가능
