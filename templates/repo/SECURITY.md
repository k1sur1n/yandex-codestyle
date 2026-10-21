<!--
Шаблон SECURITY.md - профиль Яндекса (реконструкция, см. docs/git/repository.md: Y-REPO-009).
Структура и сроки повторяют SECURITY.md проектов YDB, YTsaurus, CatBoost, DataLens и userver:
все семь файлов выборки написаны по одной схеме. Замените метки в угловых скобках и удалите комментарии.
-->

# Security Policy

<!-- Необязательная таблица поддерживаемых версий (в выборке есть только у userver). -->
## Supported Versions

| Version | Supported |
|:-|:-|
| `<DEFAULT_BRANCH>` / latest release | yes |

## Reporting a Vulnerability

We are grateful to security researchers and users who report vulnerabilities in <PROJECT>.
All reports are thoroughly investigated.

To report a potential vulnerability, please email the details to <SECURITY_EMAIL>.
Please do not open a public issue for security problems.
<!-- Альтернатива (так у CatBoost): кнопка «Report a vulnerability» на вкладке Security репозитория GitHub. -->

### When Should I Report a Vulnerability?

- You think you have discovered a potential security vulnerability in <PROJECT>.
- You are unsure how a vulnerability affects <PROJECT>.

## Security Vulnerability Response

Each report is acknowledged and analyzed by the <PROJECT> maintainers within 5 working days.
We will keep the reporter informed about the progress.

## Public Disclosure Timing

A public disclosure date is negotiated by the <PROJECT> maintainers and the reporter. We prefer to disclose
the issue as soon as a mitigation is available to users. The timeframe for disclosure is from immediate
(especially if the issue is already publicly known) to 90 days. For a vulnerability with a straightforward
mitigation, we expect the time from report to disclosure to be about 7 days.
