#!/bin/bash
# Налаштування GitHub Issues labels для KW Community проекту

# Потрібно мати gh CLI встановлений та авторизований
# https://cli.github.com/

REPO="NikolayAntonyuk/kw-community-site"

# Функція для створення label
create_label() {
    local name=$1
    local color=$2
    local description=$3

    gh label create "$name" \
        --color "$color" \
        --description "$description" \
        -R "$REPO" || echo "Label '$name' вже існує"
}

# Severity labels (важливість)
create_label "critical" "FF0000" "Критично - сайт не працює, гарячий fix"
create_label "high" "FF6600" "Висока - важна функція сломана"
create_label "medium" "FFAA00" "Середня - функція працює, але неправильно"
create_label "low" "FFDD00" "Низька - мінорне, косметичне"

# Type labels (тип)
create_label "bug" "D73A49" "Помилка / дефект"
create_label "feature-request" "A2EEEF" "Запит нової функції"
create_label "enhancement" "84B6EB" "Поліпшення існуючої функції"
create_label "documentation" "0075CA" "Документація"
create_label "testing" "FC8D62" "Тестування / QA"

# Component labels (модуль)
create_label "admin" "1D76DB" "Адмін-панель"
create_label "catalog" "0366D6" "Каталог спеціалістів"
create_label "homepage" "6F42C1" "Головна сторінка"
create_label "api" "5319E7" "Backend / API"
create_label "frontend" "7057FF" "Frontend / UI"

# Platform labels (платформа)
create_label "mobile" "3DD5F3" "Мобільна версія"
create_label "desktop" "0969DA" "Десктопна версія"
create_label "performance" "F1E05A" "Перформанс / швидкість"
create_label "security" "D93F0B" "Безпека"
create_label "accessibility" "B8860B" "Доступність (A11Y)"

# Status labels (статус)
create_label "verified" "28A745" "Підтверджено / Готово до fix"
create_label "in-progress" "0052CC" "В розробці"
create_label "blocked" "E2E4EA" "Заблоковано / Залежність"
create_label "wontfix" "E2E4EA" "Не планується фіксити"

echo "✅ GitHub labels успішно налаштовані!"
echo "Просмотрити labels можна тут: https://github.com/your-repo/labels"
