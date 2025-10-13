---
layout: post
title: "SQL Injection 입문"
date: 2025-10-08 11:30:00 +0900
categories: [security]
tags: [sqli, database]
---

## 데이터베이스를 위협하는 SQL Injection

SQL Injection은 공격자가 웹 애플리케이션의 입력 필드를 통해 악의적인 SQL 쿼리를 주입하여 데이터베이스를 직접 조작하는 공격 기법입니다. 이를 통해 데이터베이스의 정보를 탈취하거나, 데이터를 변조 또는 삭제할 수 있어 매우 치명적인 보안 위협입니다.

가장 기본적인 방어 방법은 사용자의 입력을 신뢰하지 않고, **Prepared Statements (Parameter-ized Queries)**를 사용하는 것입니다. 이는 사용자 입력이 쿼리의 구조를 변경하는 것을 원천적으로 차단합니다.
