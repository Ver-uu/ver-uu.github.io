---
layout: post
title: "CSS 변수를 이용한 테마 시스템 구축"
date: 2025-10-09 16:00:00 +0900
categories: [development]
tags: [css, frontend]
---

## 다크 모드는 어떻게 구현할까?

최신 웹사이트의 필수 기능인 다크 모드는 CSS 변수(Custom Properties)를 사용하면 매우 쉽게 구현할 수 있습니다.

먼저 `:root`에 기본 테마(주로 라이트 테마)의 색상 변수들을 정의합니다. 그 다음, `[data-theme="dark"]`와 같은 속성 셀렉터를 사용하여 다크 모드일 때의 색상 값으로 변수들을 덮어씁니다. 마지막으로 JavaScript를 사용하여 사용자의 선택에 따라 `<html>` 태그의 `data-theme` 속성을 변경해주면 됩니다.

```css
:root {
  --background-color: #fff;
  --text-color: #333;
}

[data-theme="dark"] {
  --background-color: #1a1a1a;
  --text-color: #eee;
}
```
