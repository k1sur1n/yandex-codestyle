# Сообщения коммитов - профиль Яндекса

> Данные актуальны на 2026-10-09.

Единого формата сообщений у Яндекса нет: в 25 открытых репозиториях наблюдаются четыре устойчивых стиля, а общих письменных требований к коммитам в Аркадии публично не найдено. Профиль берёт Conventional Commits в том виде, в каком его применяют Gravity UI, Diplodoc и YTsaurus UI: это единственный формат, который у Яндекса записан, проверяется инструментом и питает автоматический релиз. Сообщения пишутся по-английски, заголовок укладывается в 72 символа, ключ задачи ставится в конце заголовка в квадратных скобках. Всё, что выведено из репозиториев, - реконструкция; доли указаны для каждого правила.

Связанные документы: [repository.md](repository.md) (обязательные файлы, CLA и DCO, CI) · [branches.md](branches.md) (squash и заголовок PR) · [releases.md](releases.md) (как типы коммитов превращаются в версии) · [матрица проверок](../enforcement.md).

## Выборка и статус источников

- **Выборка.** 25 активных репозиториев из 10 организаций GitHub, по 300 последних коммитов ветки по умолчанию (у шести репозиториев история короче). Всего 6602 коммита; из них 5114 сделаны людьми и не являются merge-коммитами. Стилевые показатели считаются по коммитам людей, трейлеры - по всем коммитам. Пул-реквесты как объекты (число ревьюеров, время до слияния) не измерялись: GitHub API был недоступен. Состав выборки и метод - в [research/yandex.md](../../research/yandex.md).
- **Заголовок** здесь - первая строка сообщения. В зеркалах Аркадии строка `commit_hash:<sha>` идёт сразу после заголовка без пустой строки, поэтому `git log --format=%s` склеивает её с заголовком и завышает длину примерно на 53 символа. Если будете измерять такие истории сами, берите первую строку `%B`.
- **Письменных правил мало.** Правило о формате заголовка записано или проверяется автоматикой в 5 из 25 репозиториев (uikit, page-constructor, cli, transform, ytsaurus-ui). Ни один из 19 файлов `CONTRIBUTING.md` выборки не упоминает Conventional Commits, squash или DCO: правила живут в отдельных документах, хуках и workflow.
- **Аркадия.** Единые требования к сообщению коммита внутри монорепозитория (язык, длина, ключ тикета): публичных данных не найдено. Стиль зеркал - наблюдение, а не регламент.

## Что наблюдается

### Четыре стиля

| Стиль | Вид заголовка | Где | Доля |
|---|---|---|---|
| A. Conventional Commits | `feat(Dialog): add disableTransition prop (#2855)` | uikit, page-constructor, cli, transform, ytsaurus-ui, datalens-backend | ≥ 97 % коммитов людей в 6 из 25; 20-90 % - в 1 (ydb-go-sdk, 39,9 %); < 20 % - в 18 из 25 |
| B. Ключ тикета или компонент впереди | `YT-29880: Fix zero TabletSize bug`, `[Optimizer] Rewrite to lookup join with point predicates (#55575)` | ytsaurus, ydb, yatool, частично catboost | тикет-префикс в ≥ 10 % коммитов - 3 из 25 (ytsaurus 37,1 %, ydb 23,9 %, yatool 19,2 %) |
| C. Тип и компонент без скобок | `fix core: preserve alternate signal stacks owned by sanitizers` | userver | 1 из 25 (95,3 % коммитов userver) |
| D. Простая повелительная фраза | `Add tenant system tablet backup (#55598)`, `Fix class weights in grid and randomized search` | ydb, odyssey, ch-tools, SDK, catboost, YaFSDP, исследовательские репозитории | остальные |

Примеры взяты из истории: [uikit@c1ae095](https://github.com/gravity-ui/uikit/commit/c1ae095), [ytsaurus@572d7b82](https://github.com/ytsaurus/ytsaurus/commit/572d7b82), [ydb@282b472e](https://github.com/ydb-platform/ydb/commit/282b472e), [userver@7d7e659](https://github.com/userver-framework/userver/commit/7d7e659), [ydb@18b84c79](https://github.com/ydb-platform/ydb/commit/18b84c79), [catboost@3d704cd](https://github.com/catboost/catboost/commit/3d704cd). В пуле из 5004 коммитов людей (22 репозитория, где таких коммитов не меньше 100) Conventional Commits составляет 29,6 %, стиль userver - 5,9 %, тикет-префикс - 4,6 %.

Интерпретация: стиль определяется устройством релизов, а не вкусом команды. Где версия и changelog собираются из истории (release-please), формат обязателен и проверяется. Где изменения едут из монорепозитория с трекером, заголовок привязан к тикету. Где заметки к релизу пишут вручную (YDB, CatBoost, SDK), формат свободный.

### Язык, длина, тело, ссылки

| Показатель | Значение | Доля репозиториев |
|---|---|---|
| Кириллицы в заголовках нет вовсе | - | 15 из 25 |
| Кириллица в > 0 и < 5 % заголовков | - | 6 из 25 |
| Кириллица в ≥ 5 % заголовков | perforator 14,7 %, yatool 5,3 %, pandora 5,0 %, terraform-provider-yandex 5,0 % (все - зеркала Аркадии) | 4 из 25 |
| Медиана длины заголовка | 47,5 символа (от 24 до 69 по репозиториям) | медиана ≤ 50 - 18 из 25 |
| 90-й перцентиль длины | 71 символ (от 52 до 95) | p90 ≤ 72 - 14 из 25 |
| Заголовки длиннее 72 символов | медиана 8,5 % (от 0,4 % до 35,9 %); в пуле - 11,1 % | не больше 10 % - 14 из 25 |
| Заголовок заканчивается точкой | ≥ 5 % коммитов только у catboost | 1 из 25 |
| Заголовок с заглавной буквы | ≥ 70 % коммитов - 10 из 25; ≤ 30 % - 10 из 25 (репозитории с Conventional Commits и userver) | - |
| Непустое тело | медиана 50 % коммитов (от 4,1 % до 90,3 %) | ≥ 50 % - 11 из 25 |
| Номер PR в конце заголовка, `(#N)` | след squash-слияния на GitHub | ≥ 60 % - 9 из 25; 20-60 % - 3 |
| Ключ тикета где-либо в заголовке | `[YTFRONT-6084]`, `BI-7387`, `YT-29880:` | ≥ 10 % - 6 из 25 |

Длины посчитаны по 22 репозиториям, где не меньше 100 коммитов людей. Самые длинные заголовки - там, где в заголовок входит и тип, и ключ тикета: datalens-backend (медиана 69, длиннее 72 - 35,9 %) и ytsaurus-ui (63,5 и 29,5 %). Грамматическая форма заголовка автоматически не измерялась; в просмотренных примерах преобладает повелительное наклонение (`Add`, `Fix`, `Support`), встречается и прошедшее время (`added disable flag`).

### Трейлеры, DCO и атрибуция

| Строка | Где встречается | Комментарий |
|---|---|---|
| `Co-authored-by:` | mysync - 133 из 300 коммитов, ydb-go-sdk - 106, uikit - 92, datalens - 74 | её добавляет GitHub при squash-слиянии PR с несколькими авторами |
| `Signed-off-by:` | ≥ 50 % коммитов - 2 из 25 (odyssey 81,3 %, ytsaurus-k8s-operator 73,3 %); 5-50 % - ещё 3 | письменного требования DCO нет ни в одном репозитории - см. [Y-REPO-008](repository.md) |
| `Release-As:` | page-constructor - 6, uikit - 1, cli - 1 | команда для release-please: принудительно задать версию |
| `Tests:`, `Validation:`, `Closes:` | userver - 97, 6 и 5 из 300 | поля описания PR в Аркадии, попавшие в тело коммита |
| `Type:`, `Component:` | ytsaurus - по 14 из 300 | блок «Changelog entry» из шаблона PR |
| `commit_hash:` | 100 % коммитов - 6 из 25; частично - ещё 3 | служебная строка экспорта из Аркадии, см. ниже |
| `Pull Request resolved:` | хотя бы один коммит - 8 из 25 | след внешнего PR, принятого через Аркадию |

У userver есть проектное правило для ИИ-агентов: не добавлять в описания PR строки `Generated with …` и в коммиты трейлер `Co-Authored-By: <agent>` - [AGENTS.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dcb37ba31e9ae50d6b426e2f6a6b09/AGENTS.md#L32). Это правило одного репозитория из 25; в профиль оно не перенесено.

### Что записано или проверяется автоматикой

| Проект | Правило | Чем проверяется | Источник |
|---|---|---|---|
| gravity-ui/uikit, page-constructor | заголовок PR - по Conventional Commits; примеры `fix(TextInput): fix clear button styles`, `feat(Button): add <property-name> property` | `commitlint` с `@commitlint/config-conventional`: хук `.husky/commit-msg` (`npx commitlint -e`) и workflow «PR Title» | [pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md), [commitlint.config.js](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/commitlint.config.js), [pr-title.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/pr-title.yml) |
| diplodoc-platform/cli, transform | сообщение только на английском; формат `<type>(<scope>)[!]: <subject>`; типы `feat`, `fix`, `perf`, `refactor`, `docs`, `chore`, `revert`, `deps`; разрешены `fixup!` и `squash!` | собственный shell-хук `.husky/commit-msg` (два вызова `grep`) | [.husky/commit-msg](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.husky/commit-msg) |
| ytsaurus/ytsaurus-ui | все заголовки коммитов PR - по Conventional Commits; описание со строчной буквы; хотя бы один `feat` или `fix` заканчивается `[#N]` или `[YTFRONT-N]` | workflow «Commit titles»: регулярные выражения по всем коммитам PR | [README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md), [ci-commit-titles.yaml](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/.github/workflows/ci-commit-titles.yaml) |
| ydb-platform/ydb | формат сообщения не задан; единственный пример в руководстве - `git commit -m "Implemented feature 42"`; смысловую нагрузку несёт описание PR с разделом «Changelog entry» | - | [suggest-change.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) |
| yandex/ch-tools | ключ тикета - в квадратных скобках в последнем коммите PR или в начале имени ветки | workflow «Link with Startrek», регулярное выражение `[A-Z]+-[0-9]+` | [link_startrek.yml](https://github.com/yandex/ch-tools/blob/e2bda7b65af3/.github/workflows/link_startrek.yml) |

Итого commitlint подключён в 2 из 25 репозиториев, собственный хук - ещё в 2, регулярное выражение в CI - в 1. Отдельного пакета с конфигом commitlint у Яндекса нет: все репозитории Gravity UI подключают `@commitlint/config-conventional` напрямую, и действуют умолчания этого пакета (заголовок до 100 символов).

## Следы Аркадии в публичной истории

Часть открытых репозиториев - зеркала внутреннего монорепозитория, и их история устроена иначе, чем у проекта, который живёт на GitHub. Признаки:

- Корневой файл `.mapping.json` с таблицей «путь на GitHub → путь в Аркадии» - 9 из 25 репозиториев; рядом лежит `.piglet-meta.json` вида `{"project":"ya","repository":"arcadia"}` - [yatool](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/.piglet-meta.json).
- Строка `commit_hash:<40 hex>` в каждом коммите - 6 из 25 (ytsaurus, catboost, userver, yatool, perforator, terraform-provider-yandex). Она появилась 2024-09-12 и обозначает исходный коммит монорепозитория: один и тот же хеш встречается сразу в нескольких зеркалах - [ydb@a649640c](https://github.com/ydb-platform/ydb/commit/a649640c), [ytsaurus@93b85862](https://github.com/ytsaurus/ytsaurus/commit/93b85862), [yatool@6067700](https://github.com/yandex/yatool/commit/6067700).
- Коммиты роботов: `robot-piglet` с заголовком «Intermediate changes», `robot-contrib` с «Update contrib/libs/snappy to 1.3.1»; доля роботов доходит до 49,3 % (terraform-provider-yandex).
- Номера ревизий монорепозитория вычищены и заменены на буквальное `rXXXXXX` (1335 коммитов в истории yatool).
- В телах встречаются внутренние короткие ссылки `nda.ya.ru/…` и блок `<section id="quibbler-autodescription">` с подписью «Autodescription by Yandex Code Assistant» - [ytsaurus@73d9605f](https://github.com/ytsaurus/ytsaurus/commit/73d9605f45b007b09f34442f7afaf822dafc5c03).
- Заголовки на русском встречаются только здесь: «Временно отключить проверку якорей в документации YT» - [ytsaurus@cc1aee2e](https://github.com/ytsaurus/ytsaurus/commit/cc1aee2e).

Так выглядит внутренний коммит и принятый внешний PR после экспорта (реальные сообщения, [ytsaurus@572d7b82](https://github.com/ytsaurus/ytsaurus/commit/572d7b8281f3cccbaf80bbbcce5214cfff203119) и [catboost@968ecf3](https://github.com/catboost/catboost/commit/968ecf32c56252d2779fabfec4185ea512a8f12c)):

```text
YT-29880: Fix zero TabletSize bug
commit_hash:25a040c8ea017b48c87ec0a1878a256377a70939
```

```text
Document fit() callbacks parameter (#2393)

Closes #2393

---

Pull Request resolved: https://github.com/catboost/catboost/pull/3200

Co-authored-by: stohirov <95065111+stohirov@users.noreply.github.com>
commit_hash:5b20ba337f846ff42d2b865a824c15f3883e3b5d
```

Эти строки пишет инструмент экспорта. В обычном git-репозитории воспроизводить их незачем: они нужны только тогда, когда источник истины - внутренний монорепозиторий.

## Выбор профиля

| Вопрос | Варианты в проектах Яндекса | Что берёт профиль и почему |
|---|---|---|
| Формат заголовка | Conventional Commits (6 из 25) · тикет-префикс и компонент (зеркала Аркадии, YDB) · свободная фраза | **Conventional Commits.** Единственный формат, который записан, проверяется инструментом и воспроизводим вне Аркадии |
| Запись типа и области | `feat(Button): …` (Gravity UI, Diplodoc, YTsaurus UI) · `feat core: …` (userver) | **Со скобками.** Форма userver нигде не описана, и её не разбирают commitlint и release-please |
| Список типов | 11 типов `@commitlint/config-conventional` (Gravity UI) · 8 типов с `deps` (Diplodoc) · 9 типов без `perf` и `style` (YTsaurus UI) | **Список `config-conventional`.** Он самый широкий и совпадает с умолчанием инструмента |
| Место ключа тикета | в конце в скобках `… [YTFRONT-6084]` (YTsaurus UI) · после типа `feat: BI-7387 …` (datalens-backend) · впереди `YT-29880: …` (зеркала) | **В конце в квадратных скобках.** Не ломает разбор заголовка и проверяется в CI YTsaurus UI |
| Предел длины заголовка | 100 - умолчание commitlint у Gravity UI · 72 - ydb-embedded-ui · без проверки - остальные | **72.** На этом уровне лежит 90-й перцентиль выборки (71 символ) |
| Что проверять | только заголовок PR (uikit, squash) · каждый коммит PR (ytsaurus-ui, rebase) | **Заголовок PR при squash**, каждый коммит - при rebase; см. [Y-BR-005](branches.md) |

Решения в правой колонке - выбор авторов профиля на основе измерений, а не заявленная позиция Яндекса.

## Правила

### Y-GIT-001 · MUST · Сообщение коммита - заголовок и тело - пишется на английском языке
- Проверка: хук `commit-msg` с поиском кириллицы (так сделано в Diplodoc; скрипт профиля - [ниже](#shell-хук-без-nodejs)); в commitlint - локальное правило `subject-no-cyrillic` из [конфига ниже](#commitlint) (не Яндекс).
- Источник: [diplodoc-platform/cli · .husky/commit-msg](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.husky/commit-msg) (2026-05-15) · конфиг или инструмент · высокая; [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (кириллицы нет вовсе - 15 из 25; ≥ 5 % заголовков - только в 4 зеркалах Аркадии) · высокая.

### Y-GIT-002 · MUST · Заголовок имеет вид `<type>(<scope>): <описание>` по Conventional Commits 1.0.0; при squash-слиянии требование относится к заголовку PR или MR
- Проверка: commitlint `type-empty`, `subject-empty` (входят в `@commitlint/config-conventional`); shell-хук профиля; job «PR Title» в CI.
- Источник: [gravity-ui/uikit · contribute/pull-request.md, Pull request title](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая; [gravity-ui/uikit · pr-title.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/pr-title.yml) (HEAD 2026-10-07) · конфиг или инструмент · высокая. Доля: формат соблюдают ≥ 97 % коммитов людей в 6 из 25 репозиториев и меньше 20 % - в 18 из 25; уровень MUST относится к проектам, которые приняли формат.
- Пример:
  ```text
  # плохо
  Fixed clear button
  TextInput: fix clear button styles

  # хорошо
  fix(TextInput): fix clear button styles
  ```

### Y-GIT-003 · MUST · Тип берётся из списка `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test` и пишется строчными буквами
- Проверка: commitlint `type-enum`, `type-case`.
- Источник: [@commitlint/config-conventional · src/index.ts](https://github.com/conventional-changelog/commitlint/blob/v21.2.3/%40commitlint/config-conventional/src/index.ts) (v21.2.3) · конфиг или инструмент · высокая · не Яндекс; подключён без изменений в [gravity-ui/uikit · commitlint.config.js](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/commitlint.config.js) (HEAD 2026-10-07) · конфиг или инструмент · высокая. У Diplodoc и YTsaurus UI списки свои - см. [«Выбор профиля»](#выбор-профиля).

### Y-GIT-004 · SHOULD · Область (`scope`) - имя компонента, пакета или каталога в круглых скобках; форма без скобок (`feat core: …`) не используется
- Проверка: частично: commitlint и shell-хук отклоняют заголовок, в котором после типа нет двоеточия; осмысленность области - ручное ревью; при закрытом списке компонентов - commitlint `scope-enum`.
- Источник: [gravity-ui/uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая; [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (форма без скобок - 1 из 25, userver) · средняя · реконструкция.
- Пример:
  ```text
  # плохо - стиль userver, инструменты его не разбирают
  feat redis: support Valkey 9.2 optimistic transactions

  # хорошо
  feat(redis): support Valkey 9.2 optimistic transactions
  ```

### Y-GIT-005 · MUST · Описание начинается со строчной буквы и не заканчивается точкой
- Проверка: commitlint `subject-case`, `subject-full-stop`; у YTsaurus UI - регулярное выражение `: [a-z]+` в CI.
- Источник: [ytsaurus/ytsaurus-ui · ci-commit-titles.yaml](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/.github/workflows/ci-commit-titles.yaml) (HEAD 2026-10-09) · конфиг или инструмент · высокая; [@commitlint/config-conventional · src/index.ts](https://github.com/conventional-changelog/commitlint/blob/v21.2.3/%40commitlint/config-conventional/src/index.ts) (v21.2.3) · конфиг или инструмент · высокая · не Яндекс. Доля: точка в конце заголовка в ≥ 5 % коммитов - только 1 из 25.

### Y-GIT-006 · SHOULD · Заголовок не длиннее 72 символов; ориентир - около 50
- Проверка: commitlint `header-max-length` со значением 72 (умолчание `@commitlint/config-conventional` - 100); shell-хук профиля.
- Источник: [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (p90 ≤ 72 - 14 из 25; медиана ≤ 50 - 18 из 25) · средняя · реконструкция; [ydb-platform/ydb-embedded-ui · commitlint.config.js](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/commitlint.config.js) (HEAD 2026-10-08, вне основной выборки) · конфиг или инструмент · средняя. Жёсткий предел в 72 символа в основной выборке никто не проверяет.

### Y-GIT-007 · SHOULD · Описание называет, что делает коммит, и начинается с глагола в повелительном наклонении: `add`, `fix`, `support`, `remove`
- Проверка: ручное ревью.
- Источник: [gravity-ui/uikit · contribute/pull-request.md, примеры](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · средняя; [@commitlint/config-conventional · src/index.ts, prompt](https://github.com/conventional-changelog/commitlint/blob/v21.2.3/%40commitlint/config-conventional/src/index.ts) (v21.2.3) · конфиг или инструмент · средняя · не Яндекс. Форма глагола в выборке автоматически не измерялась · реконструкция.
- Пример:
  ```text
  # плохо
  fix(api): fixed pagination
  fix(api): pagination

  # хорошо
  fix(api): return empty page instead of 500 on last cursor
  ```

### Y-GIT-008 · SHOULD · Ключ задачи из трекера или номер issue ставится в конце заголовка в квадратных скобках: `[PROJ-123]`, `[#123]`
- Проверка: регулярное выражение в CI по заголовкам коммитов PR, например `\[(#[0-9]+|[A-Z][A-Z0-9]+-[0-9]+)\]( \(#[0-9]+\))?$`; у YTsaurus UI проверка требует ключ хотя бы в одном `feat` или `fix`.
- Источник: [ytsaurus/ytsaurus-ui · ci-commit-titles.yaml, шаг «issue|ticket»](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/.github/workflows/ci-commit-titles.yaml) (HEAD 2026-10-09) · конфиг или инструмент · средняя; [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (ключ тикета в ≥ 10 % заголовков - 6 из 25) · средняя · реконструкция.
- Пример:
  ```text
  # так выглядит экспорт из Аркадии - в профиле не используется
  YT-29880: Fix zero TabletSize bug

  # хорошо
  fix(tablet): report actual size for empty tablets [YT-29880]
  ```

### Y-GIT-009 · SHOULD · Тело отделяется от заголовка пустой строкой и объясняет, что изменено и зачем; для нетривиального изменения указано, как оно проверено
- Проверка: частично: commitlint `body-leading-blank` (в `config-conventional` - уровень предупреждения); содержание - ручное ревью.
- Источник: [Conventional Commits 1.0.0, Specification, п. 6](https://www.conventionalcommits.org/en/v1.0.0/#specification) (v1.0.0) · сторонний источник · высокая · не Яндекс; [userver@e72031f - тело с разделами Summary и Tests](https://github.com/userver-framework/userver/commit/e72031fb887df2ea51c1fe834bd938fb41a81ead) (2026) · практика, выведенная из репозиториев (непустое тело в ≥ 50 % коммитов - 11 из 25; поле `Tests:` у userver - 97 из 300) · средняя · реконструкция.

### Y-GIT-010 · MUST · Несовместимое изменение помечается знаком `!` перед двоеточием или футером `BREAKING CHANGE: <описание>`
- Проверка: ручное ревью (несовместимость инструмент не определит); по этой отметке release-please поднимает мажорную версию - см. [Y-REL-005](releases.md).
- Источник: [Conventional Commits 1.0.0, Specification, п. 11-13](https://www.conventionalcommits.org/en/v1.0.0/#specification) (v1.0.0) · сторонний источник · высокая · не Яндекс; [ytsaurus/ytsaurus-ui · README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md) (HEAD 2026-10-09) · производный гайд проекта · средняя. Уровень MUST взят из формулировки спецификации; знак `!` допускают хук Diplodoc и проверка YTsaurus UI.

### Y-GIT-011 · SHOULD · Один коммит (при squash - один PR) содержит одно логически законченное изменение; правка стиля или форматирования не смешивается с изменением поведения
- Проверка: ручное ревью.
- Источник: [ytsaurus/ytsaurus-ui · README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md) (HEAD 2026-10-09) · производный гайд проекта · средняя; [catboost/catboost · CPP_STYLE_GUIDE.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L20-L25) (HEAD 2026-10-09) · производный гайд проекта · высокая.

### Y-GIT-012 · SHOULD · В трейлерах используются только общепринятые строки (`Co-authored-by:`, `Refs:`, `BREAKING CHANGE:`, `Release-As:`); служебные строки экспорта из Аркадии (`commit_hash:`, `Pull Request resolved:`) вручную не добавляются
- Проверка: ручное ревью.
- Источник: [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (`commit_hash:` в 100 % коммитов - 6 из 25, все - зеркала Аркадии; в проектах, которые целиком живут на GitHub, - 0 %) · средняя · реконструкция.

### Y-GIT-013 · SHOULD · Формат проверяется автоматически в двух местах: локальным хуком `commit-msg` и job в CI - по заголовку PR или MR при squash, по всем коммитам PR при rebase
- Проверка: наличие хука (`.husky/commit-msg` или стадия `commit-msg` в `.pre-commit-config.yaml`) и job в CI; job входит в обязательные проверки - см. [Y-BR-007](branches.md).
- Источник: [gravity-ui/uikit · .husky/commit-msg](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.husky/commit-msg) и [pr-title.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/pr-title.yml) (HEAD 2026-10-07) · конфиг или инструмент · высокая; [ytsaurus/ytsaurus-ui · ci-commit-titles.yaml](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/.github/workflows/ci-commit-titles.yaml) (HEAD 2026-10-09) · конфиг или инструмент · высокая. Доля: автоматическая проверка есть в 5 из 25 репозиториев - во всех пяти, где формат записан.

## Какой тип выбрать

| Тип | Когда | Попадает в changelog |
|---|---|---|
| `feat` | новая возможность для пользователя | да, раздел Features; повышает минорную версию |
| `fix` | исправление ошибки | да, раздел Bug Fixes; повышает патч-версию |
| `perf` | ускорение без изменения поведения | да, раздел Performance Improvements |
| `refactor` | изменение кода, которое не исправляет ошибку и не добавляет возможность | нет |
| `docs` | только документация | нет |
| `test` | добавление или правка тестов | нет |
| `build` | система сборки и внешние зависимости | нет |
| `ci` | конфигурация и скрипты CI | нет |
| `style` | правки, не меняющие смысл кода: пробелы, форматирование | нет |
| `chore` | прочее, что не трогает исходники и тесты; релизные коммиты робота | нет |
| `revert` | откат предыдущего коммита | зависит от настроек |

Описания типов пересказаны по подсказкам [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/blob/v21.2.3/%40commitlint/config-conventional/src/index.ts) (не Яндекс). Колонка про changelog - настройка `gravity-ui/release-action`: в changelog идут только `feat`, `fix` и `perf` ([action.yml](https://github.com/gravity-ui/release-action/blob/main/action.yml)). Если коммит подходит под два типа, спецификация советует разделить его на два ([FAQ](https://www.conventionalcommits.org/en/v1.0.0/#faq), не Яндекс).

## Примеры

### Хорошо

1\. Небольшое исправление, одна строка. Номер PR `(#131)` дописал GitHub при squash-слиянии (в uikit так заканчиваются 96,4 % заголовков):

```text
fix(parser): handle empty input in tokenizer [#128] (#131)
```

2\. Новая возможность с телом и ключом задачи:

```text
feat(api): add cursor pagination to list endpoints [PROJ-482]

Offset pagination times out on tables above 10M rows. Add an opaque
cursor based on the primary key. The `offset` parameter keeps working
and is marked deprecated.

Tests: unit tests for cursor encoding, integration test on 12M rows.
```

3\. Несовместимое изменение:

```text
feat(config)!: rename `timeout` option to `request_timeout_ms`

BREAKING CHANGE: `timeout` (seconds) is removed. Use
`request_timeout_ms` (milliseconds). Old configs fail at startup
with a message that names the new option.
```

4\. Документация без области:

```text
docs: describe release process in CONTRIBUTING
```

5\. Ускорение в коде инференса, соавтор добавлен трейлером:

```text
perf(inference): reuse thread pool across batch requests [ML-77]

Creating a pool per request cost 3-4 ms on 32-core hosts. Keep one
pool per model instance and size it from `inference.threads`.

Co-authored-by: Jane Doe <jane.doe@example.org>
```

6\. Откат. Спецификация не задаёт формат откатов и предлагает тип `revert` с футером `Refs:` ([FAQ](https://www.conventionalcommits.org/en/v1.0.0/#faq), не Яндекс):

```text
revert: feat(api): add cursor pagination to list endpoints

The endpoint returns duplicates when rows are deleted between pages.

Refs: 1a2b3c4
```

7\. Релизный коммит робота (его создаёт release-please, вручную так не пишут):

```text
chore(main): release 2.4.0 (#140)
```

Реальные заголовки в этом стиле: [`feat(Dialog): add disableTransition prop (#2855)`](https://github.com/gravity-ui/uikit/commit/c1ae095), [`fix(styles): use semantic shadow token for card shadows (#1518)`](https://github.com/gravity-ui/page-constructor/commit/e52b9ed), [`feat(CHYT): configure CPU and memory when creating a clique [YTFRONT-6086]`](https://github.com/ytsaurus/ytsaurus-ui/commit/f2d8dd5), [`chore(main): release 7.51.0 (#2851)`](https://github.com/gravity-ui/uikit/commit/a2f7a1d). Третий из них занимает 74 символа - на два больше предела профиля: в самих проектах предел в 72 символа не проверяется (см. Y-GIT-006).

### Плохо

```text
Fixed bug.
```

Нет типа, прошедшее время, точка в конце, непонятно, что исправлено (Y-GIT-002, Y-GIT-005, Y-GIT-007).

```text
feat core: Добавил ретраи в клиент
```

Форма userver без скобок, русский язык, заглавная буква после двоеточия (Y-GIT-001, Y-GIT-004, Y-GIT-005).

```text
feat(api): add cursor pagination to all list endpoints of the public REST API and the gRPC gateway.
```

99 символов и точка в конце; подробности должны уйти в тело (Y-GIT-005, Y-GIT-006).

## Проверка

### commitlint

Вариант Gravity UI: `commitlint` запускается локально хуком и в CI по заголовку PR. Первая строка конфига - то, что стоит в репозиториях Яндекса; остальное - дополнения профиля.

```js
// commitlint.config.js - профиль Яндекса.
// Пакеты: @commitlint/cli и @commitlint/config-conventional. В gravity-ui/uikit - диапазон ^19.8.1
// (package.json, 2026-10-07); последняя версия на 2026-10-09 - 21.2.3, ей нужен Node.js >= 22.12.0.
// Не запускалось: реестр пакетов недоступен из среды сборки. Синтаксис файла и функция правила
// subject-no-cyrillic проверены в Node.js 22.
module.exports = {
    // Яндекс: единственная строка конфига gravity-ui/uikit, page-constructor и остальных пакетов Gravity UI.
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Y-GIT-006. В Gravity UI действует умолчание пакета - 100; 72 задаёт ydb-platform/ydb-embedded-ui.
        'header-max-length': [2, 'always', 72],
        // Y-GIT-001. Не Яндекс по форме: у Diplodoc ту же проверку делает shell-хук, а не commitlint.
        'subject-no-cyrillic': [2, 'always'],
    },
    plugins: [
        {
            rules: {
                'subject-no-cyrillic': ({raw}) => [
                    !/[Ѐ-ӿ]/.test(raw || ''),
                    'commit message must be in English (Y-GIT-001)',
                ],
            },
        },
    ],
};
```

- Если в `package.json` стоит `"type": "module"`, назовите файл `commitlint.config.cjs` или замените `module.exports =` на `export default`.
- `subject-no-cyrillic` - локальный плагин commitlint ([документация](https://github.com/conventional-changelog/commitlint/blob/v21.2.3/docs/reference/plugins.md), не Яндекс); в конфиге допускается только один локальный плагин.
- `@commitlint/config-conventional` ограничивает и строки тела 100 символами (`body-max-line-length`). При проверке одного заголовка PR это правило не срабатывает; при проверке каждого коммита длинные URL в теле придётся переносить.
- Локальный запуск у Gravity UI: husky 9, файл `.husky/commit-msg` из одной строки `npx commitlint -e` - [uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.husky/commit-msg).

### Shell-хук без Node.js

Вариант Diplodoc: проверку делает короткий shell-скрипт. Он подходит репозиториям на Python и C++, где Node.js нет. Скрипт профиля написан по образцу [хука Diplodoc](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.husky/commit-msg) (MIT); отличия: список типов взят из `config-conventional`, добавлены предел длины, запрет заглавной буквы и точки, а комментарии git (строки с `#`) отбрасываются до проверки.

```sh
#!/bin/sh
# commit-msg - проверка сообщения коммита по профилю Яндекса (Y-GIT-001…006).
# Образец: .husky/commit-msg в diplodoc-platform/cli (MIT); список типов - из @commitlint/config-conventional.
# Нужны только POSIX sh, sed, grep, head. Проверено локально: dash 0.5.12 и bash 5.2, GNU grep 3.11.
set -eu

msg_file="$1"
# Убрать комментарии git и всё, что ниже линии «ножниц» (git commit --verbose).
msg=$(sed -e '/^# -\{24\} >8 -\{24\}$/,$d' -e '/^#/d' "$msg_file")
subject=$(printf '%s\n' "$msg" | head -n 1)

fail() {
    printf 'commit-msg: %s\n  заголовок: %s\n' "$1" "$subject" >&2
    exit 1
}

# Служебные сообщения git: autosquash и локальные слияния (в основную ветку они не попадают).
case "$subject" in
    'fixup! '*|'squash! '*|'amend! '*|'Merge '*) exit 0 ;;
esac

# Y-GIT-001: только английский. Байты 0xD0-0xD3 - первые байты UTF-8 для U+0400-U+04FF (кириллица).
cyrillic=$(printf '[\320-\323]')
if printf '%s\n' "$msg" | LC_ALL=C grep -q "$cyrillic"; then
    fail 'в сообщении есть кириллица - пишите по-английски (Y-GIT-001)'
fi

# Y-GIT-002, Y-GIT-003: <type>(<scope>)!: <описание>
types='build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test'
if ! printf '%s\n' "$subject" | grep -Eq "^($types)(\([^()[:space:]]+\))?!?: [^[:space:]]"; then
    fail "ожидается '<type>(<scope>): <описание>', типы: $types (Y-GIT-002, Y-GIT-003)"
fi

# Y-GIT-005: описание со строчной буквы, без точки в конце.
if printf '%s\n' "$subject" | grep -Eq '^[a-z]+(\([^)]*\))?!?: [A-Z]'; then
    fail 'описание начинается со строчной буквы (Y-GIT-005)'
fi
case "$subject" in
    *.) fail 'точка в конце заголовка не ставится (Y-GIT-005)' ;;
esac

# Y-GIT-006: не длиннее 72 символов (кириллица уже отсеяна, поэтому байты = символы для ASCII).
if [ "${#subject}" -gt 72 ]; then
    fail "заголовок длиннее 72 символов: ${#subject} (Y-GIT-006)"
fi
```

Скрипт прогнан локально в dash и bash на 26 сообщениях: 10 примеров из раздела выше и 16 заголовков из таблиц и правил этого документа. Результат совпал с ожидаемым везде, кроме двух реальных заголовков Яндекса длиннее 72 символов - их скрипт отклоняет по Y-GIT-006. Кроме того, скрипт установлен как `.git/hooks/commit-msg` в тестовом репозитории и проверен на настоящих коммитах. Тот же скрипт лежит готовым файлом: [configs/git/commit-msg](../../configs/git/commit-msg). Подключение: скопировать его в `.husky/commit-msg`, либо в `scripts/commit-msg` с локальным хуком фреймворка pre-commit на стадии `commit-msg` - см. [configs/.pre-commit-config.yaml](../../configs/.pre-commit-config.yaml). Фреймворк pre-commit в выборке есть у 1 из 25 репозиториев, поэтому сам способ подключения - «не Яндекс».

### CI: GitHub и GitLab

При squash-слиянии в историю попадает заголовок PR, поэтому проверять нужно его. Шаг Gravity UI подставляет заголовок прямо в команду; в профиле он передаётся через переменную окружения, чтобы текст заголовка не исполнялся как часть скрипта (это отличие - не Яндекс).

```yaml
# .github/workflows/pr-title.yml - по образцу gravity-ui/uikit. Не запускалось: workflow исполняется только на GitHub.
name: PR Title

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify_title:
    name: Verify Title
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Run Commitlint
        env:
          PR_TITLE: ${{ github.event.pull_request.title }}
        run: printf '%s\n' "$PR_TITLE" | npx commitlint
```

```yaml
# .gitlab-ci.yml - перенос на GitLab - не Яндекс. Не запускалось: нужен раннер GitLab.
mr-title:
  stage: lint
  image: node:22-alpine
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script:
    - npm ci
    - printf '%s\n' "$CI_MERGE_REQUEST_TITLE" | npx commitlint
```

Для репозитория без Node.js замените две последние строки на `printf '%s\n' "$CI_MERGE_REQUEST_TITLE" > title.txt` и `sh scripts/commit-msg title.txt`. Оба фрагмента разобраны PyYAML локально. Полные файлы CI - в [templates/github/workflows/lint.yml](../../templates/github/workflows/lint.yml) и [templates/gitlab/.gitlab-ci.yml](../../templates/gitlab/.gitlab-ci.yml).

Различия платформ, существенные для коммитов:

| Тема | GitHub | GitLab (перенос - не Яндекс) |
|---|---|---|
| Заголовок squash-коммита | при настройке «Default commit message: Pull request title» - заголовок PR, к нему GitHub дописывает `(#N)`; при настройке по умолчанию у PR из одного коммита берётся сообщение этого коммита - [документация](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests) | шаблон squash-сообщения, по умолчанию `%{title}`; ссылку на MR добавляют переменной `%{reference}` или `%{local_reference}` - [документация](https://docs.gitlab.com/user/project/merge_requests/commit_templates/) |
| Проверка на сервере без CI | нет | Push rules: «Require expression in commit messages», «Reject expression in commit messages»; только Premium и Ultimate; синтаксис RE2 - [документация](https://docs.gitlab.com/user/project/repository/push_rules/) |
| Проверка заголовка MR без CI | нет | настройка «Title pattern» в Settings > Merge requests: заголовок MR должен совпасть с выражением RE2, иначе слияние заблокировано; Premium и Ultimate, общедоступно с GitLab 18.10 - [документация](https://docs.gitlab.com/user/project/merge_requests/title_validation/) |
| Переменная с заголовком | `github.event.pull_request.title` | `CI_MERGE_REQUEST_TITLE` |

Общая таблица различий платформ - в [repository.md](repository.md#github-и-gitlab-различия-платформ).

## Чего в профиле нет и почему

- Правил оформления сообщений внутри Аркадии: публичных данных не найдено. Ключ тикета впереди заголовка - соглашение отдельных команд (в истории yatool почти все такие коммиты относятся к очереди `YT`), а не правило всего монорепозитория.
- Письменного описания формата userver (`feat core: …`) не найдено ни в `CONTRIBUTING.md`, ни в `AGENTS.md`, ни в документации проекта.
- Требования `Signed-off-by` нет - см. [Y-REPO-008](repository.md).
- Предела длины строк тела нет: в выборке он не измерялся, а умолчание commitlint (100) - решение пакета, не Яндекса.
