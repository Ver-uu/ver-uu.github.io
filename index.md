---
layout: home
title: "Home"
author_profile: true
# 상단 히어로(헤더) — 네온 스킨과 대비 좋게
header:
  overlay_color: "#000"
  overlay_filter: "0.35"     # 어두운 오버레이
  caption: " "
  actions:
    - label: "Start Reading"
      url: "/blog/"
    - label: "Categories"
      url: "/categories/"
    - label: "Guestbook"
      url: "/guestbook/"

# 사람용 요약(히어로 아래 한 줄)
excerpt: "Kali · Web/Cloud Security · Exploit — 따라 하며 구성하는 실무형 보안 기록"

# 카드 데이터(카테고리 바로가기) — Minimal Mistakes의 feature_row 사용
feature_row:
  - image_path: /assets/images/card-web.png
    alt: "Web Security"
    title: "Web Security"
    excerpt: "SSTI/SSRF/XSS/SQLi · 재현과 우회, 대응"
    url: "/categories/#web-security"
    btn_label: "Browse"
    btn_class: "btn--primary"
  - image_path: /assets/images/card-cloud.png
    alt: "Cloud Security"
    title: "Cloud Security"
    excerpt: "AWS IAM/CloudTrail/EC2 Metadata · 공격 시나리오"
    url: "/categories/#cloud-security"
    btn_label: "Browse"
    btn_class: "btn--primary"
  - image_path: /assets/images/card-hw.png
    alt: "Hardware Security"
    title: "Hardware Security"
    excerpt: "펌웨어/임베디드/장치 기반 보안"
    url: "/categories/#hardware-security"
    btn_label: "Browse"
    btn_class: "btn--primary"
  - image_path: /assets/images/card-os.png
    alt: "Operating Systems"
    title: "Operating Systems"
    excerpt: "리눅스 권한 상승·SUID·Capabilities"
    url: "/categories/#operating-systems"
    btn_label: "Browse"
    btn_class: "btn--primary"
  - image_path: /assets/images/card-net.png
    alt: "Networking"
    title: "Networking"
    excerpt: "프록시·터널링·TLS/HTTP 이해"
    url: "/categories/#networking"
    btn_label: "Browse"
    btn_class: "btn--primary"

# 최근 글 리스트에 요약(발췌) 표시
show_excerpts: true
---

{% include feature_row %}

<!-- 안내 섹션 -->
### Welcome
**Veru_Log**은 _실습 중심_ 보안 블로그입니다. Kali 환경 구성, Burp 운용, Web/Cloud 취약점 재현과 레드팀 시나리오를 정리합니다.  
요청/피드백은 [Guestbook](/guestbook/)에 남겨주세요.
