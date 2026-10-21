# Код-ревью - профиль Яндекса

> Данные актуальны на 2026-10-09.

Внутри Яндекса ревью идёт в сервисе Arcanum, а правила (кого назначить, сколько одобрений, когда вливать автоматически) задаются декларативно по каталогам в файлах `a.yaml`; общего публичного регламента ревью нет. В открытых репозиториях письменные правила есть у трёх проектов: YDB (одобрение участника команды, для документации - два ревьюера), Gravity UI (одобрение всех вызванных владельцев кода) и библиотеки `util` (сроки ответа, заброшенные запросы, откат без ревью). Число обязательных одобрений, размер PR и сроки ревью кода публично не описаны. Ниже - 15 практических правил; у каждого указано, записано оно в проекте Яндекса, реконструировано или взято со стороны.

Связанные документы: [repository.md](repository.md) (`CODEOWNERS`, шаблон PR) · [branches.md](branches.md) (защита ветки, обязательные проверки) · [commits.md](commits.md) · [матрица проверок](../enforcement.md).

## Статус источников

- **Внутренняя практика** известна по трём видам публичных источников: статьи сотрудников на Хабре (2018-2026), страница Yandex Platform Engineering и файлы, попавшие наружу вместе с открытым кодом (`a.yaml` в `yandex/yatool`, `util/README.md` в зеркале CatBoost). Сам Arcanum и его документация недоступны, поэтому смысл полей `a.yaml` выведен из примеров.
- **Открытые репозитории.** 25 репозиториев выборки; `CODEOWNERS` есть у 7, шаблон PR - у 9. Пул-реквесты как объекты (число ревьюеров, время до слияния, доля внешних PR) не измерялись: GitHub API был недоступен. Процесс описан по документам проектов, а не по статистике PR. Состав выборки - в [research/yandex.md](../../research/yandex.md).
- **Чего нет.** У большинства из 25 репозиториев процесс ревью не описан вовсе: `CONTRIBUTING.md` состоит из блока про CLA. Настройки защиты веток видны только администраторам.

## Что известно о ревью внутри Яндекса

### Arcanum и `a.yaml`

- Arcanum - внутренний веб-сервис для работы с репозиторием: навигация по коду, код-ревью, запуск проверок - [infra.yandex.ru/ype](https://infra.yandex.ru/ype), [журнал Яндекс Образования](https://education.yandex.ru/journal/kakie-tekhnologii-yandeks-stroit-dlya-komand-razrabotki).
- В монорепозиторий нельзя закоммитить напрямую: изменение оформляется как пул-реквест и вливается после одобрения - [Хабр, 2020](https://habr.com/ru/companies/yandex/articles/482926/).
- Правила ревью лежат рядом с кодом, в файле `a.yaml` каталога. Пример - владелец конфига `clang-format` по умолчанию ([cpp_style/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml)):

```yaml
service: cppcommittee
title: clang-format default config

arcanum:
  review:
    auto_assign: true
    min_approvers_count: 1
    groups:
      - name: cppcommittee
        roles: cppcommittee:consultant
    rules:
      - subpaths: ".clang-format"
        reviewers:
          - name: cppcommittee
            assign: 1
            ship: 0
            ignore_self_ship: false
```

| Поле | Что задаёт (по примерам) | Аналог в git-хостинге |
|---|---|---|
| `service` | сервис-владелец каталога | команда в `CODEOWNERS` |
| `auto_assign` | автоматическое назначение ревьюеров | автоназначение владельцев кода |
| `min_approvers_count` | минимальное число одобрений | число обязательных одобрений в защите ветки |
| `groups` | группа ревьюеров как роль в сервисе | команда GitHub или группа GitLab |
| `rules.subpaths`, `rules.authors` | к каким путям и к чьим изменениям применяется правило | шаблон пути в `CODEOWNERS`; фильтра по автору в хостингах нет |
| `reviewers.assign` | сколько человек из группы назначить | - |
| `reviewers.ship` | сколько одобрений нужно от группы; `0` - группа только уведомляется | секция `CODEOWNERS` с числом одобрений в GitLab |
| `auto_merge.requirements` | условие автослияния, например `comment_issues_closed` - все замечания закрыты | auto-merge плюс «Require conversation resolution before merging» |
| `ci.triggers` с `on: pr`, `required: always` | обязательная проверка CI на PR | required status checks |

Одобрение в Arcanum называется `ship` - это видно по именам полей. Правила могут зависеть от автора: в [build/conf/ts/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/conf/ts/a.yaml) изменения от команды сборки ревьюит она сама, а владельцы кода получают уведомление; изменения от всех остальных ревьюят владельцы. Автослияние с условием «замечания закрыты» включено, например, для конфига ruff - [ruff/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/a.yaml).

Интерпретация: трактовка полей `assign`, `ship` и `ignore_self_ship` выведена из трёх файлов; документации по схеме `a.yaml` публично нет, уверенность средняя.

### Регламент одной команды: `util`

Базовая C++-библиотека `util` публикует свой порядок приёма изменений - [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L33-L60) (файл экспортируется из Аркадии; состояние на 2026-10-09):

- для коммита нужно одобрение одного из участников группы `util`;
- без ревью допускаются исправления грамматики и опечаток, приведение кода к стайлгайду и откат ломающего изменения, попавшего в trunk;
- если комментариев нет один-два рабочих дня, автор вежливо напоминает в чате;
- запрос на ревью считается заброшенным, если автор не обновлял его три месяца или ушёл из компании; такие запросы ревьюеры закрывают, и любой коммиттер может открыть их заново;
- довести ревью до конца - обязанность автора.

### Проверки и ИИ-ревью

- В 2018 году прекоммитные проверки запускались добровольно и были обязательны только «для особо важных проектов»; после коммита на каждое изменение шли сборки, проверки стиля и быстрые тесты - [Хабр, 2018](https://habr.com/ru/companies/yandex/articles/428972/).
- В 2026 году порядок описан иначе: сначала обязательные тесты и статические анализаторы, затем ручное ревью. Первого комментария человека можно было ждать несколько часов; автоматический ревьюер NeuroReview комментирует через 2-3 минуты, подключается добровольно, принимается около 30 % его замечаний. Через него проходит примерно 4 тысячи пул-реквестов в день - около 40 % созданных разработчиками в Аркадии. Последнее слово и ответственность за код остаются за человеком - [Хабр, 2026-10-07](https://habr.com/ru/companies/yandex/articles/1089752/).
- Из принятых замечаний людей 31 % относится к бизнес-логике, 35 % - к рефакторингу, 23 % - мелкие, 1,8 % - ошибки использования языка (там же).
- Дефолтные конфиги стиля принадлежат «комитетам» по языкам: правку `.clang-format` и конфига `clang-tidy` ревьюит `cppcommittee`, правку `ruff.toml` - Python Committee - [cpp_style/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml), [ruff/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/a.yaml).

Чего найти не удалось - публичных данных не найдено: обязательно ли ревью для любого изменения в Аркадии; единое число одобрений; аналог сертификации readability (персональный допуск ревьюера по языку); очередь слияния и поведение при конфликте в trunk.

## Что показывают открытые репозитории

| Проект | Правило | Источник |
|---|---|---|
| YDB | PR можно слить после одобрения участника команды YDB; после одобрения участник команды нажимает Merge | [suggest-change.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) |
| YDB, документация | роли: автор, основной ревьюер (назначается автоматически), финальный ревьюер; ожидаемый срок одной итерации - два рабочих дня; основной ревьюер включает auto-merge и передаёт PR финальному, чьё одобрение - обязательное условие слияния; чек-лист из 11 пунктов | [review.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) |
| Gravity UI (uikit) | владельцы кода вызываются автоматически; нужно одобрение всех вызванных владельцев; сливает один из владельцев; PR закрывает хотя бы один issue и содержит тесты | [pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) |
| Diplodoc | в защите ветки включены число одобрений и ревью владельцев кода (видно по комментарию в workflow); PR ботов - релизные и с обновлением зависимостей - одобряет служебная учётная запись, но только после зелёного CI и только если все коммиты сделаны ботом | [auto-approve.yml](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.github/workflows/auto-approve.yml) (HEAD 2026-10-08) |
| page-constructor | `package.json`, `package-lock.json` и `CHANGELOG.md` оставлены без владельца, чтобы релизный PR мог одобрить любой участник | [CODEOWNERS](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2/CODEOWNERS) |
| Perforator | нетривиальный PR связан с issue, получившим метку `accepted` | [CONTRIBUTING.md](https://github.com/yandex/perforator/blob/9ae889ad6be7/CONTRIBUTING.md) |
| userver | новая функциональность и исправление ошибки обязаны быть покрыты тестами; внутренние задачи имеют приоритет перед внешними PR | [AGENTS.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dcb37ba31e9ae50d6b426e2f6a6b09/AGENTS.md), [releases.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/docs/en/userver/development/releases.md) |
| yandex-ai-studio-sdk | если автор не настроил pre-commit локально, исправления в PR закоммитит робот | [CONTRIBUTING.md](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819/CONTRIBUTING.md) |

Письменного требования «N одобрений» нет ни в одном проекте. Фактический минимум - одно одобрение участника команды (YDB) или одобрение всех затронутых владельцев кода (uikit).

## Правила

Статус каждого правила:

| ID | Статус | Основание |
|---|---|---|
| Y-CR-001 | записанное правило | YDB, `util` |
| Y-CR-002 | записанное правило | Gravity UI |
| Y-CR-003 | реконструкция | `a.yaml`, Gravity UI, документация YDB |
| Y-CR-004 | записанное правило | YDB, Gravity UI |
| Y-CR-005 | записанное правило | userver, `util`, Gravity UI |
| Y-CR-006 | реконструкция | статья о NeuroReview, YDB |
| Y-CR-007 | записанное правило | документация YDB, `util` |
| Y-CR-008 | записанное правило | `util` |
| Y-CR-009 | реконструкция | `a.yaml` |
| Y-CR-010 | записанное правило | `util` |
| Y-CR-011 | реконструкция | `a.yaml` комитетов |
| Y-CR-012 | реконструкция | статья о NeuroReview |
| Y-CR-013 | записанное правило | документация YDB |
| Y-CR-014 | реконструкция | Diplodoc, page-constructor |
| Y-CR-015 | не Яндекс | Google eng-practices |

«Записанное правило» означает правило конкретного проекта или команды, а не всего Яндекса.

### Y-CR-001 · MUST · PR сливается только после одобрения хотя бы одного участника команды
- Проверка: GitHub - число обязательных одобрений в правиле «Require a pull request before merging»; GitLab - Approval rules, поле «Approvals required» (Premium и Ultimate; перенос на GitLab - не Яндекс).
- Источник: [YDB · suggest-change.md, Review and merge](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · высокая; [util/README.md, Submitting a patch](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L35-L38) (HEAD 2026-10-09) · производный гайд проекта · высокая.

### Y-CR-002 · MUST · Если изменение затрагивает код с владельцами, нужно одобрение каждого вызванного владельца
- Проверка: частично: GitHub - «Require review from Code Owners» (достаточно одного владельца на совпавший шаблон, «всех» обеспечивает ручное ревью); GitLab - «Require approval from code owners», секции `CODEOWNERS` с числом одобрений (Premium и Ultimate; перенос на GitLab - не Яндекс).
- Источник: [gravity-ui/uikit · contribute/pull-request.md, Code review](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая. Доля: `CODEOWNERS` есть в 7 из 25 репозиториев; устройство файла - [Y-REPO-013](repository.md).

### Y-CR-003 · SHOULD · Ревьюеры назначаются автоматически по путям изменённых файлов
- Проверка: наличие `CODEOWNERS`: GitHub сам запрашивает ревью у владельцев изменённых файлов; в GitLab ту же роль играют `CODEOWNERS` и правила одобрения (перенос на GitLab - не Яндекс).
- Источник: [yatool · cpp_style/a.yaml, `auto_assign`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml) (HEAD 2026-10-09) · конфиг или инструмент · высокая; [gravity-ui/uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая · реконструкция.

### Y-CR-004 · MUST · Сливает PR участник команды или владелец кода - после одобрения и зелёных проверок; внешний автор сам не сливает
- Проверка: права на запись в репозиторий и защита ветки; GitLab - «Allowed to merge» в защищённой ветке (перенос на GitLab - не Яндекс).
- Источник: [YDB · suggest-change.md, Review and merge](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · высокая; [gravity-ui/uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая.

### Y-CR-005 · MUST · PR с новой функциональностью или исправлением ошибки содержит тесты на неё
- Проверка: ручное ревью; пункт в шаблоне PR; при желании - порог покрытия в CI (не Яндекс).
- Источник: [userver · AGENTS.md, Tests and documentation](https://github.com/userver-framework/userver/blob/5fc4b311b0dcb37ba31e9ae50d6b426e2f6a6b09/AGENTS.md) (HEAD 2026-10-09) · производный гайд проекта · высокая; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L19-L23) (HEAD 2026-10-09) · производный гайд проекта · высокая; [gravity-ui/uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая.

### Y-CR-006 · SHOULD · Автоматические проверки идут раньше ручного ревью: ревьюер получает PR, в котором тесты, линтеры и статический анализ уже прошли
- Проверка: обязательные проверки CI - см. [Y-BR-007](branches.md); по образцу YDB PR считается готовым к ревью, когда он не черновик и сборка прошла.
- Источник: [Хабр · NeuroReview](https://habr.com/ru/companies/yandex/articles/1089752/) (2026-10-07) · книга, статья или доклад · высокая; [YDB · documentation/review.md, шаг 2](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая · реконструкция.

### Y-CR-007 · SHOULD · Ревьюер отвечает на каждую итерацию в пределах двух рабочих дней; если ответа нет, автор вежливо напоминает
- Проверка: ручное ревью; напоминания - ботом или вручную.
- Источник: [YDB · documentation/review.md, шаг 5](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L40-L41) (HEAD 2026-10-09) · производный гайд проекта · высокая. У YDB срок записан для ревью документации; для ревью кода срок публично не указан.

### Y-CR-008 · SHOULD · Довести PR до слияния - обязанность автора; PR, который автор не обновлял три месяца, считается заброшенным и может быть закрыт
- Проверка: ручной разбор очереди или stale-бот (не Яндекс); закрытый PR любой участник может открыть заново.
- Источник: [util/README.md, Stale/abandoned review request policy](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L50-L60) (HEAD 2026-10-09) · производный гайд проекта · высокая.

### Y-CR-009 · SHOULD · Замечания ревью закрываются до слияния; автослияние включается с условием «все обсуждения закрыты»
- Проверка: GitHub - «Require conversation resolution before merging» и auto-merge; GitLab - auto-merge ждёт закрытия обсуждений, если проект этого требует (перенос на GitLab - не Яндекс).
- Источник: [yatool · ruff/a.yaml, `auto_merge`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/a.yaml) (HEAD 2026-10-09) · конфиг или инструмент · средняя; [YDB · documentation/review.md, шаг 6](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая · реконструкция.

### Y-CR-010 · SHOULD · Откат изменения, сломавшего основную ветку, сливается без ожидания содержательного ревью
- Проверка: ручное ревью; право обхода защиты ветки у дежурного или мейнтейнера. В `util` без ревью допускаются ещё правки опечаток и приведение к стайлгайду; в git-репозитории с защищённой веткой они всё равно идут через PR.
- Источник: [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L43-L48) (HEAD 2026-10-09) · производный гайд проекта · высокая.

### Y-CR-011 · SHOULD · У конфигов стиля и CI есть отдельный владелец, и их правка требует его ревью
- Проверка: строки в `CODEOWNERS` для `.clang-format`, `.clang-tidy`, `pyproject.toml`, `eslint.config.js`, каталога CI и самого `CODEOWNERS`.
- Источник: [yatool · cpp_style/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml) и [ruff/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/a.yaml) (HEAD 2026-10-09) · конфиг или инструмент · высокая · реконструкция; у YDB каталог `/.github/` закреплён за командой CI - [CODEOWNERS](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/.github/CODEOWNERS).
- Пример:
  ```text
  # CODEOWNERS (синтаксис GitHub)
  /.clang-format     @<ORG>/cpp-style
  /pyproject.toml    @<ORG>/python-style
  /.github/          @<ORG>/ci
  ```

### Y-CR-012 · SHOULD · ИИ-ревью используется как первый проход; решение о слиянии и ответственность за код остаются за человеком
- Проверка: ручное ревью; одобрение бота не засчитывается как обязательное одобрение.
- Источник: [Хабр · NeuroReview](https://habr.com/ru/companies/yandex/articles/1089752/) (2026-10-07) · книга, статья или доклад · высокая · реконструкция. В Аркадии подключение добровольное.

### Y-CR-013 · SHOULD · Изменение документации проходит ревью по чек-листу; в проекте с выделенными ревьюерами документации - в два этапа: основной и финальный ревьюер
- Проверка: ручное ревью; чек-лист копируется в описание PR.
- Источник: [YDB · documentation/review.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая. В YDB одобрение финального ревьюера - обязательное условие слияния; в профиле уровень понижен, потому что двух ревьюеров документации в небольшой команде обычно нет. Правила самой документации - [Y-DOC-001…011](repository.md).

### Y-CR-014 · SHOULD · PR, созданные автоматикой (релизы, обновление зависимостей), проходят те же проверки CI; одобрять их может служебная учётная запись - только после зелёного CI
- Проверка: отдельный workflow одобрения; альтернатива - оставить `CHANGELOG.md` и файлы версий без владельца в `CODEOWNERS`.
- Источник: [diplodoc-platform/cli · auto-approve.yml](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.github/workflows/auto-approve.yml) (HEAD 2026-10-08) · конфиг или инструмент · низкая; [gravity-ui/page-constructor · CODEOWNERS](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2/CODEOWNERS) (HEAD 2026-10-05) · конфиг или инструмент · низкая · реконструкция. Доля: 2 из 25.

### Y-CR-015 · SHOULD · PR решает одну задачу и остаётся небольшим - таким, чтобы его можно было внимательно прочитать за один подход
- Проверка: ручное ревью.
- Источник: [Google eng-practices · Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html#what-is-small) (CC-BY 3.0) · сторонний источник · высокая · не Яндекс. О размере PR у Яндекса: публичных данных не найдено; ближайшее по смыслу - правило YTsaurus UI о небольших логически законченных коммитах, см. [Y-GIT-011](commits.md).

## Как это настроить

| Правило | GitHub | GitLab (перенос - не Яндекс) |
|---|---|---|
| Y-CR-001 | правило «Require a pull request before merging»: число одобрений - 1 | Approval rules: «Approvals required» - 1; Premium и Ultimate |
| Y-CR-001, автор не одобряет сам себя | автор PR не может одобрить собственный PR (на это правило GitHub ссылается и workflow Diplodoc) | «Prevent approval by merge request creator» - по умолчанию выключено, включить; Premium и Ultimate |
| Y-CR-002 | «Require review from Code Owners» | «Require approval from code owners» в защищённой ветке; Premium и Ultimate |
| Y-CR-009 | «Require conversation resolution before merging»; auto-merge сливает PR, когда собраны обязательные одобрения и прошли обязательные проверки | «Set to auto-merge»; слияние ждёт одобрений, пайплайна и закрытия обсуждений |
| Y-CR-004 | роль с правом записи; при необходимости «Restrict who can push to matching branches» | «Allowed to merge» в защищённой ветке |

Названия настроек взяты из документации: GitHub - [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [Automatically merging a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request); GitLab - [Approval settings](https://docs.gitlab.com/user/project/merge_requests/approvals/settings/), [Protected branches](https://docs.gitlab.com/user/project/repository/branches/protected/), [Auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/). На бесплатном тарифе GitLab обязательных одобрений и одобрения владельцев кода нет: правила Y-CR-001 и Y-CR-002 остаются договорённостью. Различия синтаксиса `CODEOWNERS` - в [repository.md](repository.md#github-и-gitlab-различия-платформ).

## Что переносится из внутренней практики, а что нет

| Практика в Аркадии | Переносится на git-репозиторий | Чем заменить |
|---|---|---|
| Ревьюеры и число одобрений по путям в `a.yaml` | да | `CODEOWNERS` и правило об одобрениях |
| Отдельный владелец конфигов стиля (комитет) | да | строки `CODEOWNERS` на конфиги - Y-CR-011 |
| Автослияние при закрытых замечаниях и зелёных проверках | да | auto-merge хостинга - Y-CR-009 |
| Регламент `util`: срок ответа, заброшенные запросы, откат без ревью | да | раздел в `CONTRIBUTING.md` - Y-CR-007, Y-CR-008, Y-CR-010 |
| ИИ-ревью первым проходом | да | любой ИИ-ревьюер в PR - Y-CR-012 |
| Правила, зависящие от автора (`authors` в `a.yaml`) | нет: в `CODEOWNERS` такого фильтра нет | договорённость команды |
| Привязка ревью к внутренним ролям и сервисам | нет | команды GitHub, группы GitLab |

Правая часть таблицы - рассуждение авторов профиля; рекомендаций Яндекса о переносе практик Аркадии в git публично нет.

## Чего в профиле нет и почему

- Числа обязательных ревьюеров больше одного: публичных данных не найдено.
- Сроков ревью кода: публичных данных не найдено; два рабочих дня записаны только для документации YDB и для `util`.
- Аналога readability-сертификации Google: публичных данных не найдено.
- Правил о тоне комментариев и о разрешении споров между автором и ревьюером: публичных данных не найдено. Общепринятая альтернатива - раздел о ревью в [Google eng-practices](https://google.github.io/eng-practices/review/reviewer/standard.html) (не Яндекс).
