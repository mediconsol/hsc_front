# HSC1 Frontend (Rails + Hotwire)

병원 관리 시스템 프런트엔드 애플리케이션입니다. 백엔드와 별도 레포로 분리하여 Railway에 독립 배포합니다.

## 요구사항

- Ruby 3.x
- Bundler

## 환경 변수

- `RAILS_ENV`: production/development/test
- `RAILS_MASTER_KEY`: `config/master.key` 내용 (필수)
- `BACKEND_API_URL`: 백엔드 API URL (예: `https://api.example.com/api/v1`)

## Tailwind CSS

- 입력: `app/assets/stylesheets/application.tailwind.css`
- 출력: `app/assets/builds/tailwind.css` (assets:precompile 시 생성)
- `config/initializers/assets.rb`에 `app/assets/builds` 경로가 포함되어야 함
- 레이아웃에서 `stylesheet_link_tag "tailwind"`로 참조

## 로컬 개발

```bash
bundle install
bin/rails assets:precompile
bin/rails s -p 7002
# http://localhost:7002
```

## 배포

Railway(Dockerfile 기반) 배포 가이드는 `DEPLOYMENT.md` 참고.
