# Версии, теги, релизы и changelog - профиль Яндекса

> Данные актуальны на 2026-10-09.

У открытых проектов Яндекса две схемы. Библиотеки и SDK выпускаются по SemVer с тегами `vX.Y.Z`, часто несколько раз в неделю и автоматически; серверные продукты (YDB, YTsaurus) используют календарные номера и долгоживущие стабильные ветки с бэкпортами. Релизы автоматизированы через release-please в 5 из 25 репозиториев, ещё в нескольких changelog пишут люди, а его наличие проверяет CI. Общего письменного правила о версиях нет: схему записали YDB и ydb-go-sdk, остальное - реконструкция. Профиль по умолчанию берёт SemVer, тег `vX.Y.Z` и release-please; календарная схема описана как вариант для продукта с долгой поддержкой.

Связанные документы: [commits.md](commits.md) (типы коммитов, из которых собирается релиз) · [branches.md](branches.md) (стабильные ветки и бэкпорты) · [repository.md](repository.md) (`CHANGELOG.md` среди файлов репозитория).

## Выборка и статус источников

- **Выборка.** 25 репозиториев; имена тегов получены через `git ls-remote --tags`, даты - отдельной загрузкой тегов 2026-10-09. У лёгких тегов датой считается дата коммита, поэтому частота релизов за 12 месяцев может быть немного смещена. Страницы GitHub Releases не проверялись (API был недоступен): речь везде о тегах. Состав выборки - в [research/yandex.md](../../research/yandex.md).
- **Письменные схемы** есть у YDB (сервер и CLI), ydb-go-sdk и userver. Политика поддержки версий (сколько стабильных веток живёт и как долго) описана только у YDB и частично у userver; для остальных - публичных данных не найдено.
- **Сайт и репозиторий YDB расходятся.** Опубликованная страница [ydb.tech/docs/en/contributor/manage-releases](https://ydb.tech/docs/en/contributor/manage-releases) 2026-10-09 описывала трёхчисловую версию, а файл в ветке `main` - четырёхчисловую. Профиль опирается на `main`: он новее (изменён 2026-08-03) и совпадает с измеренными тегами (`N.N.N.N` - 207 тегов).
- **release-please** - инструмент Google (`googleapis/release-please`, Apache-2.0). В профиле он описан потому, что его используют проекты Яндекса; сведения о самом инструменте помечены «не Яндекс».

## Что наблюдается

### Теги

| Показатель | Доля (из 25) | Где |
|---|---|---|
| Тегов нет вовсе | 5 | yatool, YaFSDP, mysync, graphland, tabred |
| ≥ 90 % тегов похожи на SemVer | 15 | ydb-go-sdk, ydb-python-sdk, ytsaurus, ytsaurus-k8s-operator, ytsaurus-ui, perforator, ch-tools, pandora, uikit, page-constructor, cli, transform, terraform-provider-yandex, datalens, datalens-backend |
| Преобладает `vX.Y.Z` | 14 | ydb-go-sdk, catboost, perforator, odyssey, ch-tools, pandora, uikit, page-constructor, cli, transform, yandex-ai-studio-sdk, terraform-provider-yandex, datalens, datalens-backend |
| Преобладает `X.Y.Z` без `v` | 1 | ydb-python-sdk |
| Тег с именем компонента | 3 | ytsaurus (`python/ytsaurus-client/0.13.55`, `yt/go/vN.N.N`, `chyt/N.N.N`), ytsaurus-k8s-operator (`release/N.N.N`, `api/vN.N.N`), ytsaurus-ui (`ui-v3.28.0`, `components-vN.N.N`) |
| Хотя бы 12 тегов за 12 месяцев | 14 | - |
| Хотя бы 1 тег за 12 месяцев | 18 | - |

Другие схемы: `vN.N` у userver (20 тегов из 21), четырёхчисловые `N.N.N.N` и теги `CLI_N.N.N` у YDB. Предварительные версии записывают по-разному: `-rcN` (ydb-go-sdk - 219 тегов), `-rc.N` (datalens-backend - 529), `-alpha.N` (page-constructor - 118), `-beta.N` (uikit - 17), `bN` в стиле Python (ydb-python-sdk - 14, yandex-ai-studio-sdk - 7).

Чаще всего выпускаются (релизы без предварительных версий за 12 месяцев): cli - 174, ydb-go-sdk - 127, transform - 75, ytsaurus-ui - 70, terraform-provider-yandex - 66, page-constructor - 55, ydb-python-sdk - 51, uikit - 44. Аннотированные теги в большинстве только у трёх репозиториев (yandex-ai-studio-sdk, ch-tools, catboost), в девяти их нет совсем - правила об аннотированных тегах в профиле нет.

### Как делают релизы и changelog

| Механизм | Доля (из 25) | Где | Как устроено |
|---|---|---|---|
| release-please | 5 | напрямую - ytsaurus-ui, cli, transform; через `gravity-ui/release-action@v1` - uikit, page-constructor | workflow на push в основную ветку держит открытым релизный PR; его слияние ставит тег, обновляет `CHANGELOG.md` и запускает публикацию пакета |
| Ручной `CHANGELOG.md` и workflow с роботом | 2 | ydb-go-sdk, ydb-python-sdk | запись добавляется в PR; workflow `publish` запускается вручную, вписывает заголовок версии, коммитит «Release vX.Y.Z» от имени робота и ставит тег |
| changie | 2 | terraform-provider-yandex, pandora | на каждое изменение - файл в `.changes/unreleased/`; `CHANGELOG.md` собирается из них |
| Запись для changelog в описании PR | 2 | ydb, ytsaurus | раздел «Changelog entry» в шаблоне PR; заметки к релизу публикуются в документации |
| goreleaser | 1 | terraform-provider-yandex | сборка и публикация на push тега |
| Ручной `RELEASE.md` | 1 | catboost | разделы по версиям, пункты с метками `[Build]`, `[CUDA]` и благодарностями авторам |
| Генерация changelog из коммитов с помощью LLM | 1 | userver | скрипт `scripts/changelog_tool` классифицирует коммиты и учитывает раздел «Changelog entry» в сообщении |

`CHANGELOG.md` в корне есть у 9 из 25 репозиториев. Строки таблицы пересекаются (terraform-provider-yandex использует и changie, и goreleaser).

Ссылки: [ytsaurus-ui · release-please-config.json](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/release-please-config.json), [cli · release-please.yml](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.github/workflows/release-please.yml), [uikit · release.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/release.yml), [gravity-ui/release-action · action.yml](https://github.com/gravity-ui/release-action/blob/main/action.yml), [ydb-go-sdk · publish.yml](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/.github/workflows/publish.yml), [terraform-provider-yandex · .changie.yaml](https://github.com/yandex-cloud/terraform-provider-yandex/blob/d74186099777/.changie.yaml), [catboost · RELEASE.md](https://github.com/catboost/catboost/blob/963da016857b/RELEASE.md), [userver · changelog_tool](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/changelog_tool/README.md).

Так выглядит changelog, который пишет release-please (фрагмент [uikit/CHANGELOG.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/CHANGELOG.md), ссылки сокращены):

```markdown
## [7.51.0](…/compare/v7.50.1...v7.51.0) (2026-10-06)

### Features

* **Dialog:** add disableTransition prop ([#2855](…)) ([c1ae095](…))
```

А так - changelog, который пишут люди ([ydb-go-sdk/CHANGELOG.md](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/CHANGELOG.md)): заголовок `## v3.155.0` и пункты в прошедшем времени, начинающиеся с `Fixed`, `Added`, `Deprecated`.

### Какие версии release-please используют проекты

| Проект | Действие в workflow | Особенности |
|---|---|---|
| diplodoc-platform/cli, transform | `googleapis/release-please-action@v4` | конфиг `.release-please-config.json` и манифест `.release-please-manifest.json`; токен бота; workflow копируется из общего шаблона Diplodoc |
| ytsaurus/ytsaurus-ui | `google-github-actions/release-please-action@v3` с `command: manifest` | монорепозиторий из шести пакетов, `"separate-pull-requests": true`, плагин `node-workspace`, типы `node`, `helm`, `simple` |
| gravity-ui/uikit, page-constructor | `gravity-ui/release-action@v1`, внутри - `google-github-actions/release-please-action@v3` | `release-type: node`, `bump-minor-pre-major: true`; в changelog идут `feat`, `fix`, `perf`; после релиза - публикация в npm; токен GitHub App |

Актуальные версии самого инструмента на 2026-10-09 (не Яндекс): release-please 17.11.2 от 2026-08-24, `googleapis/release-please-action` v5.0.0 от 2026-04-22 (переход на Node.js 24), последний выпуск четвёртой ветки - v4.4.1 от 2026-03-30. Проекты Яндекса на v5 ещё не перешли.

### Записанные схемы версий

- **YDB, сервер.** Версия из четырёх чисел: две последние цифры года, номер мажорного релиза в году, минорный релиз, патч. В год обычно четыре мажорных релиза. Мажорная ветка `stable-XX-Y` принимает новые функции и исправления; минорная ветка `stable-XX-Y-Z` - только исправления, из неё собираются релизы и на ней ставится тег `XX.Y.Z.A`; для срочных исправлений от тега отводится ветка `stable-XX-Y-Z-A-hotfix`. В нечётных мажорных версиях новая функциональность выключена флагами, в чётных включена по умолчанию; кластер может работать на двух соседних мажорных версиях - [manage-releases.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/manage-releases.md).
- **YDB, CLI.** Три числа; теги с префиксом `CLI_` ставит в `main` участник release-команды после прогона тестов - там же.
- **ydb-go-sdk.** SemVer 2.0.0 с тремя исключениями: API с комментарием `// Experimental` может ломаться без смены мажорной версии; `// Deprecated` не удаляется минимум шесть месяцев; `// Internals` не считается стабильным - [VERSIONING.md](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/VERSIONING.md).
- **userver.** Релизы - снимки ветки `develop` с гарантией стабильности API, новый минорный релиз раз в месяц-два; исправления в старые релизы не переносятся - [releases.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/docs/en/userver/development/releases.md).

## Выбор профиля

| Вопрос | Варианты в проектах Яндекса | Что берёт профиль и почему |
|---|---|---|
| Схема версий | SemVer, релиз из основной ветки (библиотеки, SDK) · календарная версия и стабильные ветки (YDB, YTsaurus) | **По типу проекта.** Библиотека, SDK, сервис с непрерывной выкладкой - SemVer. Продукт, который пользователи ставят у себя и обновляют редко, - календарная схема. По умолчанию - SemVer |
| Формат тега | `vX.Y.Z` - 14 из 25 · `X.Y.Z` - 1 · с именем компонента - 3 | **`vX.Y.Z`**; имя компонента добавляется только при нескольких пакетах в одном репозитории |
| Запись предварительной версии | `-rcN` · `-rc.N` · `-alpha.N`, `-beta.N` · `bN` | **Через точку: `-rc.N`, `-beta.N`, `-alpha.N`** - форма из спецификации SemVer; для пакетов PyPI допустима запись `bN`, как у ydb-python-sdk |
| Changelog | генерируется из коммитов (release-please, 5 из 25) · пишется людьми в PR (`CHANGELOG.md`, changie, раздел в описании PR - 6 из 25) | **Генерация из коммитов** вместе с Conventional Commits; если формулировки для пользователей важнее автоматизации - запись в PR с проверкой в CI, как в ydb-go-sdk |

Два способа ведения changelog решают одну задачу; смешивать их в одном репозитории незачем. Это вывод авторов профиля, а не правило Яндекса.

## Правила

### Y-REL-001 · SHOULD · Библиотека, SDK и сервис с непрерывной выкладкой версионируются по SemVer 2.0.0
- Проверка: регулярное выражение по именам тегов в CI; release-please выдаёт только такие версии.
- Источник: [ydb-go-sdk · VERSIONING.md](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/VERSIONING.md) (HEAD 2026-10-08) · производный гайд проекта · высокая; [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (≥ 90 % тегов похожи на SemVer - 15 из 25) · высокая · реконструкция. Сама спецификация - [semver.org](https://semver.org/) (не Яндекс).

### Y-REL-002 · SHOULD · Тег релиза - `vX.Y.Z`; предварительные версии - `vX.Y.Z-rc.N`, `vX.Y.Z-beta.N`, `vX.Y.Z-alpha.N`
- Проверка: `git tag --list` и выражение `^v[0-9]+\.[0-9]+\.[0-9]+(-(alpha|beta|rc)\.[0-9]+)?$`; GitLab - защищённые теги по маске `v*` (перенос на GitLab - не Яндекс).
- Источник: [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (`v`-префикс преобладает в 14 из 25) · высокая · реконструкция; запись предварительной версии - [semver.org, п. 9](https://semver.org/) · сторонний источник · высокая · не Яндекс. Там же сказано, что `v1.2.3` - имя тега, а семантическая версия - `1.2.3`.

### Y-REL-003 · SHOULD · В репозитории с несколькими публикуемыми пакетами тег несёт имя компонента: `<component>-vX.Y.Z`; для Go-модуля в подкаталоге - `<путь>/vX.Y.Z`
- Проверка: release-please, опция `include-component-in-tag` (при одном пакете её выключают - так сделано у Diplodoc); остальное - ручное ревью.
- Источник: [ytsaurus/ytsaurus-ui · release-please-config.json](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/release-please-config.json) (HEAD 2026-10-09) · конфиг или инструмент · высокая; [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (3 из 25: ytsaurus, ytsaurus-k8s-operator, ytsaurus-ui) · средняя · реконструкция.

### Y-REL-004 · SHOULD · Версию, тег и `CHANGELOG.md` формирует release-please из заголовков коммитов; человек только сливает релизный PR
- Проверка: наличие `release-please-config.json`, `.release-please-manifest.json` и workflow на push в основную ветку; в истории - коммиты робота вида `chore(main): release X.Y.Z`.
- Источник: [diplodoc-platform/cli · release-please.yml](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.github/workflows/release-please.yml) (HEAD 2026-10-08); [gravity-ui/uikit · release.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/release.yml) (HEAD 2026-10-07) · конфиг или инструмент · высокая. Доля: 5 из 25 (3 напрямую, 2 через `gravity-ui/release-action`). На GitLab инструмент не работает - см. [раздел о GitLab](#gitlab-перенос---не-яндекс).

### Y-REL-005 · MUST · Тип коммита определяет версию: `fix` - патч, `feat` - минор, `!` или `BREAKING CHANGE` - мажор; PR, который должен попасть в релиз, содержит хотя бы один `feat` или `fix`
- Проверка: release-please вычисляет версию сам; у YTsaurus UI наличие `feat` или `fix` проверяет шаг «feat|fix» в CI.
- Источник: [ytsaurus/ytsaurus-ui · README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md) и [ci-commit-titles.yaml](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/.github/workflows/ci-commit-titles.yaml) (HEAD 2026-10-09) · производный гайд проекта · высокая; [release-please · README, How should I write my commits?](https://github.com/googleapis/release-please#how-should-i-write-my-commits) (v17.11.2) · конфиг или инструмент · высокая · не Яндекс. Уровень MUST: соответствие зашито в инструмент; изменить результат можно только явно - футером `Release-As:` или настройкой стратегии версий.

### Y-REL-006 · SHOULD · До версии 1.0.0 несовместимое изменение повышает минорную версию, а не мажорную
- Проверка: release-please, опция `bump-minor-pre-major: true`.
- Источник: [gravity-ui/release-action · action.yml](https://github.com/gravity-ui/release-action/blob/main/action.yml) (HEAD 2026-04-06) · конфиг или инструмент · высокая; смысл опции - [release-please · manifest-releaser.md](https://github.com/googleapis/release-please/blob/v17.11.2/docs/manifest-releaser.md) (v17.11.2) · конфиг или инструмент · высокая · не Яндекс.

### Y-REL-007 · SHOULD · При автоматическом релизе `CHANGELOG.md` и номер версии вручную не правятся: их меняет только релизный PR
- Проверка: ручное ревью; у page-constructor `CHANGELOG.md` и `package.json` оставлены без владельца в `CODEOWNERS`, чтобы релизный PR одобрял любой участник.
- Источник: [gravity-ui/page-constructor · CODEOWNERS](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2/CODEOWNERS) (HEAD 2026-10-05) · конфиг или инструмент · средняя; [userver · AGENTS.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dcb37ba31e9ae50d6b426e2f6a6b09/AGENTS.md) (HEAD 2026-10-09) · производный гайд проекта · средняя · реконструкция.

### Y-REL-008 · SHOULD · Если changelog пишут люди, запись добавляется в том же PR, что и изменение, а её наличие проверяет CI
- Проверка: job с `Zomzog/changelog-checker` и метка `no changelog` для исключений (ydb-go-sdk); `changie new` и файл в `.changes/unreleased/` (terraform-provider-yandex); раздел «Changelog entry» в шаблоне PR (YDB, YTsaurus).
- Источник: [ydb-go-sdk · changelog.yml](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/.github/workflows/changelog.yml) (HEAD 2026-10-08) · конфиг или инструмент · высокая; [terraform-provider-yandex · CONTRIBUTING.md](https://github.com/yandex-cloud/terraform-provider-yandex/blob/d74186099777/CONTRIBUTING.md) (HEAD 2026-10-09) · производный гайд проекта · высокая. Доля: запись добавляют в PR (в `CHANGELOG.md`, через changie или в описании PR) в 6 из 25 репозиториев; автоматически её наличие проверяет 1 (ydb-go-sdk).

### Y-REL-009 · MUST · Запись для changelog пишется по-английски и описывает, что изменилось для пользователя, а не что сделано в коде
- Проверка: ручное ревью; для автоматического changelog то же требование относится к заголовкам `feat` и `fix`.
- Источник: [YDB · suggest-change.md, Requirements for Changelog Entry](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · высокая; [ytsaurus/ytsaurus-ui · README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md) (HEAD 2026-10-09) · производный гайд проекта · средняя.
- Пример:
  ```text
  # плохо - про код
  refactor TTabletCell::ComputeSize and add nullptr check

  # хорошо - про поведение
  Fixed zero tablet size reported for empty tablets
  ```

### Y-REL-010 · SHOULD · Продукт, который пользователи разворачивают сами и обновляют редко, получает календарную версию `YY.N.M.K` и стабильные ветки `stable-YY-N` и `stable-YY-N-M`
- Проверка: ручное ревью; защита веток по маске `stable-*`.
- Источник: [YDB · manage-releases.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/manage-releases.md) (2026-08-03) · официальный гайд · высокая. Похожие ветки по наблюдению: `stable/YY.N` у YTsaurus, `REL_X_Y_Z` у odyssey, `release/X.Y` у perforator. Критерий выбора схемы сформулирован авторами профиля · реконструкция.

### Y-REL-011 · SHOULD · Тег и релиз создаёт workflow или участник release-команды после прохождения тестов; релизный коммит делает робот
- Проверка: ручное ревью; GitHub - ruleset для тегов, GitLab - защищённые теги с ограничением «Allowed to create» (перенос на GitLab - не Яндекс).
- Источник: [YDB · manage-releases.md, Release tags](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/manage-releases.md) (2026-08-03) · официальный гайд · высокая; [ydb-go-sdk · publish.yml](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/.github/workflows/publish.yml) (HEAD 2026-10-08) · конфиг или инструмент · высокая.

### Y-REL-012 · SHOULD · Прошлая мажорная версия, которую ещё поддерживают, живёт в ветке `release/vN`; релизы из неё выпускает тот же workflow
- Проверка: триггер workflow релиза на ветки `main` и `release/v*`.
- Источник: [gravity-ui/uikit · release.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/release.yml) (HEAD 2026-10-07) · конфиг или инструмент · средняя; [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (ветки прошлых мажорных версий: uikit `v1`…`v5` и `release/v6`, cli `v4`…`v6`, ydb-go-sdk `v2`) · средняя · реконструкция.

### Y-REL-013 · SHOULD · Экспериментальный, устаревший и внутренний API помечаются комментарием в коде; устаревший API живёт не меньше шести месяцев до удаления
- Проверка: частично: использование устаревшего API находят линтеры языка (для Go в источнике названы `staticcheck` и `go-critic`); срок - ручное ревью.
- Источник: [ydb-go-sdk · VERSIONING.md](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/VERSIONING.md) (HEAD 2026-10-08) · производный гайд проекта · высокая. Правило одного проекта.

## Готовая настройка: release-please на GitHub

Три файла. Конфиг и манифест - JSON, комментариев в них быть не может, поэтому пояснения здесь.

- Версии: `googleapis/release-please-action@v4` - как в diplodoc-platform/cli; release-please 17.11.2. Для перехода на v5 замените тег на `v5`: действие станет исполняться на Node.js 24.
- Проверка: `release-please-config.json` проверен локально по схеме `schemas/config.json` из release-please v17.11.2 (`jsonschema` 4.26.0); YAML разобран PyYAML 6.0.3. Сам workflow не запускался: он исполняется только на GitHub.
- `release-type`: `python` для пакета с `pyproject.toml`, `simple` для репозитория с `version.txt` (подходит проекту на C++), `node` для npm-пакета.
- Разделы changelog повторяют настройку `gravity-ui/release-action`: `feat`, `fix`, `perf`.
- Токен: со встроенным `GITHUB_TOKEN` релизный PR не запускает другие workflow, поэтому проекты Яндекса используют токен бота (Diplodoc) или GitHub App (Gravity UI).

`release-please-config.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "packages": {
    ".": {
      "release-type": "python",
      "include-component-in-tag": false,
      "bump-minor-pre-major": true,
      "changelog-path": "CHANGELOG.md",
      "changelog-sections": [
        {"type": "feat", "section": "Features"},
        {"type": "fix", "section": "Bug Fixes"},
        {"type": "perf", "section": "Performance Improvements"}
      ]
    }
  }
}
```

`.release-please-manifest.json` (текущая версия пакета):

```json
{
  ".": "0.1.0"
}
```

`.github/workflows/release.yml`:

```yaml
# Профиль Яндекса: релизы через release-please, как в diplodoc-platform/cli (release-please.yml).
# googleapis/release-please-action v4 (последний v4 - 4.4.1 от 2026-03-30); текущий мажор - v5.0.0 от 2026-04-22.
# Не запускалось: workflow исполняется только на GitHub. Синтаксис YAML проверен локально (PyYAML 6.0.3).
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - name: Release Please
        id: release
        uses: googleapis/release-please-action@v4
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
          # Токен бота или GitHub App; со встроенным GITHUB_TOKEN CI на релизном PR не запустится.
          token: ${{ secrets.RELEASE_BOT_TOKEN }}
```

Публикацию пакета (PyPI, npm, сборка бинарных файлов) добавляют следующим шагом с условием `if: ${{ steps.release.outputs.release_created }}` - так сделано в [ytsaurus-ui](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/.github/workflows/release-please.yaml).

Что нужно знать о самом инструменте (не Яндекс, [README release-please](https://github.com/googleapis/release-please#readme)):

- Он не публикует пакеты и не управляет сложными схемами веток: его дело - релизный PR, тег, запись в changelog и GitHub Release.
- Авторы рекомендуют squash-слияние и линейную историю - это согласуется с [Y-BR-005](branches.md).
- Версию можно задать принудительно футером `Release-As: X.Y.Z` в теле коммита; в выборке он встречается у page-constructor, uikit и cli.

## GitLab: перенос - не Яндекс

Публичных данных о релизах проектов Яндекса на GitLab не найдено. release-please работает только через API GitHub, поэтому на GitLab нужна замена. Два общепринятых варианта:

1. **Тег ставит человек, релиз создаёт CI.** Job с ключевым словом `release` запускается на пайплайне тега. Пример по [документации GitLab](https://docs.gitlab.com/user/project/releases/release_cicd_examples/):

   ```yaml
   # .gitlab-ci.yml - перенос на GitLab - не Яндекс. Не запускалось: нужен раннер GitLab.
   release:
     stage: release
     image: registry.gitlab.com/gitlab-org/cli:latest
     rules:
       - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
     script:
       - echo "release $CI_COMMIT_TAG"
     release:
       tag_name: $CI_COMMIT_TAG
       description: $CI_COMMIT_TAG
   ```

   Changelog при этом ведут вручную по правилу Y-REL-008. Встроенный генератор changelog GitLab (`glab changelog generate`) группирует коммиты по трейлеру `Changelog:`, а не по типам Conventional Commits - [документация](https://docs.gitlab.com/user/project/changelogs/). Теги вида `v*` стоит защитить - [Protected tags](https://docs.gitlab.com/user/project/protected_tags/).

2. **Версия выводится из коммитов сторонним инструментом.** Самый распространённый - semantic-release с плагином `@semantic-release/gitlab` (на 2026-10-09 версии 25.0.9 и 13.3.3). В этой работе он не запускался и не сверялся с документацией, поэтому готового конфига в профиле нет.

| Тема | GitHub | GitLab |
|---|---|---|
| Автоматический релизный PR | release-please | нет аналога от Яндекса или Google; сторонние инструменты |
| Создание релиза из тега | GitHub Release создаёт release-please или `gh release create` (так делает ydb-go-sdk) | ключевое слово `release` в `.gitlab-ci.yml` |
| Защита тегов | ruleset с целью «теги» | Protected tags, маска `v*`; доступно на всех тарифах |
| Генерация changelog | из Conventional Commits (release-please) | из трейлеров `Changelog:` (`glab changelog generate`) |

## Чего в профиле нет и почему

- Сроков поддержки версий и числа одновременно живых стабильных веток: публичных данных не найдено (кроме правила YDB о двух соседних мажорных версиях).
- Требования к аннотированным или подписанным тегам: в выборке аннотированные теги преобладают только у 3 из 25 репозиториев.
- Формата `CHANGELOG.md` для ручного ведения: единого нет - ydb-go-sdk пишет пункты в прошедшем времени, ydb-python-sdk - в настоящем.
- goreleaser и changie описаны как наблюдение (по 1-2 репозитория, оба - проекты на Go); конфигов для них в профиле нет.
