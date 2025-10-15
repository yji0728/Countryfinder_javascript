# Countryfinder_javascript

🌍 **IP 국가 조회기** - 대량 IP 주소의 국가 정보를 조회하는 오프라인 웹 애플리케이션

## 주요 기능

- ✅ **오프라인 지원**: 내부망 PC에서 인터넷 연결 없이 사용 가능
- ✅ **대량 조회**: 한 번에 여러 IP 주소의 국가 정보 조회
- ✅ **한글 출력**: 국가명을 한글로 표시 (국가코드도 함께 제공)
- ✅ **Excel 연동**: 복사 기능으로 Excel에 바로 붙여넣기 가능
- ✅ **CSV 내보내기**: 조회 결과를 CSV 파일로 저장
- ✅ **컬럼 선택**: 원하는 컬럼만 선택하여 복사/내보내기
- ✅ **API 지원**: JavaScript로 프로그래밍 방식 접근 가능
- ✅ **모든 라이브러리 내장**: 외부 의존성 없이 단일 HTML 파일로 실행

## 사용 방법

### 1. 웹 브라우저에서 직접 실행

1. `index.html` 파일을 더블 클릭하여 웹 브라우저에서 엽니다
2. IP 주소 입력란에 조회할 IP 주소를 입력합니다 (한 줄에 하나씩)
   ```
   8.8.8.8
   1.1.1.1
   208.67.222.222
   180.70.102.148
   ```
3. **"🔍 조회하기"** 버튼을 클릭합니다
4. 결과 테이블에서 IP 주소, 국가명(한글), 국가코드, 대륙 정보를 확인합니다

### 2. Excel에서 복사하여 사용

1. 조회 결과에서 원하는 행을 체크박스로 선택 (선택 안 하면 전체)
2. 상단의 컬럼 선택에서 원하는 컬럼을 체크
3. **"📋 복사하기"** 버튼 클릭
4. Excel을 열고 `Ctrl+V`로 붙여넣기

### 3. CSV 파일로 내보내기

1. 조회 결과에서 원하는 데이터 선택
2. **"📥 CSV 내보내기"** 버튼 클릭
3. 자동으로 `ip_country_YYYY-MM-DD.csv` 파일이 다운로드됩니다
4. Excel이나 다른 스프레드시트 프로그램에서 열기

### 4. JavaScript API로 사용

웹 페이지에서 JavaScript 콘솔을 열거나 다른 스크립트에서 사용:

```javascript
// 단일 IP 조회
const result = CountryFinderAPI.lookup('8.8.8.8');
console.log(result);
// 출력: { ip: '8.8.8.8', country: '미국', code: 'US', continent: '북아메리카' }

// 여러 IP 조회
const ips = ['8.8.8.8', '1.1.1.1', '208.67.222.222'];
const results = CountryFinderAPI.lookupBulk(ips);
console.log(results);
```

### 5. Excel VBA에서 사용

```vba
' Internet Explorer 객체를 사용한 예제
Sub LookupIPCountry()
    Dim IE As Object
    Dim result As String
    
    ' Internet Explorer 객체 생성
    Set IE = CreateObject("InternetExplorer.Application")
    IE.Visible = False
    
    ' HTML 파일 로드 (로컬 파일 경로)
    IE.Navigate "file:///C:/Users/YourName/Desktop/Countryfinder_javascript/index.html"
    
    ' 페이지 로드 대기
    Do While IE.Busy Or IE.readyState <> 4
        DoEvents
    Loop
    
    ' JavaScript 함수 호출
    result = IE.Document.parentWindow.CountryFinderAPI.lookup("8.8.8.8").country
    
    MsgBox "Country: " & result
    
    IE.Quit
    Set IE = Nothing
End Sub
```

## 출력 데이터

각 IP 주소에 대해 다음 정보를 제공합니다:

| 컬럼 | 설명 | 예시 |
|------|------|------|
| IP 주소 | 조회한 IP 주소 | `8.8.8.8` |
| 국가명 (한글) | 한글 국가명 | `미국` |
| 국가코드 | ISO 2자리 국가코드 | `US` |
| 대륙 | 대륙명 (한글) | `북아메리카` |

## 지원 국가

주요 국가들의 한글 이름을 지원합니다:
- 🇰🇷 대한민국 (KR)
- 🇺🇸 미국 (US)
- 🇯🇵 일본 (JP)
- 🇨🇳 중국 (CN)
- 🇬🇧 영국 (GB)
- 🇩🇪 독일 (DE)
- 🇫🇷 프랑스 (FR)
- 🇨🇦 캐나다 (CA)
- 🇦🇺 호주 (AU)
- 그 외 40+ 개국

## 파일 구조

```
Countryfinder_javascript/
├── index.html          # 메인 HTML 파일 (UI)
├── app.js             # 애플리케이션 로직
├── ip-database.js     # IP-국가 매핑 데이터베이스
└── README.md          # 이 파일
```

## 기술 스택

- **HTML5**: 사용자 인터페이스
- **CSS3**: 모던 스타일링 (그라디언트, 애니메이션)
- **Vanilla JavaScript**: 외부 라이브러리 없이 순수 JavaScript
- **Offline-first**: 모든 데이터와 코드가 로컬에 저장됨

## 오프라인 사용

이 애플리케이션은 완전히 오프라인으로 동작합니다:
- ✅ 외부 CDN 없음
- ✅ 외부 API 호출 없음
- ✅ 모든 IP 데이터가 로컬에 저장
- ✅ 인터넷 연결 불필요

## 브라우저 호환성

- ✅ Chrome / Edge (권장)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Internet Explorer 11 (일부 기능 제한)

## 성능

- 대량 IP 조회 지원 (수천 개)
- 빠른 검색 알고리즘
- 메모리 효율적

## 라이선스

MIT License

## 기여

이슈나 개선 사항이 있으시면 GitHub에서 이슈를 등록해주세요.

## 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 이용해주세요.

---

**Made with ❤️ for offline IP country lookup**