# Frontend Deployment (Railway + Docker)

## 개요

이 문서는 Frontend(웹) 단일 레포를 Railway에 Dockerfile 기반으로 배포하는 절차를 설명합니다.

## 환경 변수 (Railway → Variables)

```bash
RAILS_ENV=production
RAILS_MASTER_KEY=<config/master.key 내용>
BACKEND_API_URL=https://<backend-domain>/api/v1
RAILS_MAX_THREADS=5
```

## 서비스 설정

- Root Directory: `/`
- Build: Dockerfile 자동 인식 (assets:precompile 실행)
- Start: Dockerfile CMD

## Tailwind 확인

- `app/assets/builds/tailwind.css`가 배포 빌드에서 생성/서빙되는지 확인
- 페이지 `<head>`에 `<%= stylesheet_link_tag "tailwind" %>` 가 포함되어야 함

## 문제 해결

- BACKEND_API_URL 누락 시 로그인/데이터 로드 실패 → 변수 설정
- Tailwind 404: `assets:precompile` 로그 확인, `app/assets/builds` 경로 설정 확인
