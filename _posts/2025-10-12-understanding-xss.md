---
layout: post
title: "Cross-Site Scripting (XSS) 이해하기"
date: 2025-10-12 11:00:00 +0900
categories: [security]
tags: [xss, web-security]
---

## XSS란 무엇인가?

Cross-Site Scripting (XSS)는 공격자가 웹 애플리케이션에 악의적인 스크립트를 삽입하여 다른 사용자의 브라우저에서 실행되게 하는 웹 보안 취약점입니다.

이 공격을 통해 공격자는 사용자의 세션 쿠키를 탈취하거나, 웹사이트의 내용을 변조하는 등의 악의적인 행위를 할 수 있습니다. 모든 웹 개발자는 이 보안 위협에 대해 이해하고 방어 코드를 작성해야 합니다.
