# Ветки и процесс PR/MR - профиль Яндекса

> Данные актуальны на 2026-10-09.

Открытые проекты Яндекса работают по модели trunk-based: короткие ветки от `main`, слияние через PR без merge-коммитов (squash или rebase), линейная история. Стабильные ветки есть только у серверных продуктов, которые пользователи разворачивают сами. Письменных правил о ветках три: формат имени `members/<user>/<описание>` у YTsaurus, «Squash and merge» в гайде YDB по документации и «rebase вместо squash» у YTsaurus UI; остальное - реконструкция по 25 репозиториям. Профиль берёт `main`, squash по умолчанию и обязательные проверки CI до слияния.

Связанные документы: [repository.md](repository.md) (шаблон PR, `CODEOWNERS`, CI) · [commits.md](commits.md) (заголовок PR как заголовок коммита) · [code-review.md](code-review.md) (кто одобряет и кто сливает) · [releases.md](releases.md) (теги и стабильные ветки).

## Выборка и статус источников

- **Выборка.** Те же 25 репозиториев, что в остальных документах профиля: 6602 коммита, из них 5114 сделаны людьми; имена веток получены через `git ls-remote --heads` 2026-10-09. Состав выборки и метод - в [research/yandex.md](../../research/yandex.md).
- **Чего не видно.** Настройки защиты веток, список обязательных проверок и разрешённые способы слияния доступны только администраторам репозиториев. Способ слияния выведен из истории: суффикс `(#N)` в заголовке - след squash, отсутствие merge-коммитов - признак линейной истории. Пул-реквесты как объекты не измерялись.
- **Что относится к внутренней практике.** Про Аркадию известно из статей сотрудников: разработка ведётся в основной ветке (trunk), коммитить в неё напрямую нельзя - только через пул-реквест. Схема именования веток и правила их жизни в Arc: публичных данных не найдено.
- **Зеркала Аркадии** (6 из 25 с `commit_hash:` в каждом коммите) образцом git-процесса не служат: в них нет слияния PR кнопкой и рабочих веток в привычном смысле. Как они принимают внешние PR - в [отдельном разделе](#как-зеркала-аркадии-принимают-внешние-pr).

## Что наблюдается

### Ветка по умолчанию

| Имя | Доля (из 25) | Где |
|---|---|---|
| `main` | 15 | ydb, ydb-python-sdk, ytsaurus, ytsaurus-k8s-operator, ytsaurus-ui, yatool, perforator, YaFSDP, ch-tools, uikit, page-constructor, datalens, datalens-backend, graphland, tabred |
| `master` | 8 | ydb-go-sdk, catboost, odyssey, mysync, cli, transform, yandex-ai-studio-sdk, terraform-provider-yandex |
| `develop` | 1 | userver |
| `dev` | 1 | pandora |

### Имена рабочих веток

| Схема | Статус | Где и сколько |
|---|---|---|
| `members/<user-name>/<short-description>`: строчные буквы, слова через дефис, описание до 30 символов; пример `members/khlebnikov/copilot-instructions` | записано и, по словам проекта, обеспечено правилом защиты веток | YTsaurus: 200 из 453 веток начинаются с `members/` - [copilot-instructions.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/.github/copilot-instructions.md) |
| `<type>/<описание>`: `feat/…`, `fix/…`, `chore/…`, `test/…` | наблюдение | uikit: 25, 15 и 3 ветки из 145; page-constructor: 19, 13 и 8 из 106 |
| Ключ задачи в имени: `YTFRONT-…`, `DOCSTOOLS-…`, `MDB-…` | наблюдение; у ch-tools используется автоматикой | ytsaurus-ui - 39 веток, cli - 79, ch-tools - 5; [link_startrek.yml](https://github.com/yandex/ch-tools/blob/e2bda7b65af3/.github/workflows/link_startrek.yml) |
| Ник автора как префикс: `khlebnikov/…` | наблюдение | ytsaurus-k8s-operator - 26 из 36 веток; ytsaurus-ui, datalens-backend |
| Свободное имя в форке (`feature42`) | записано как пример | YDB - [suggest-change.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) |

Ветки, которые создаёт автоматика, идут под собственными префиксами и под правило именования не подпадают: `release-please--…` (релизные PR), `ci/update-deps/…` (обновление зависимостей у Diplodoc), `cherry-pick-stable-*` (713 веток у YDB), `changelog-*` (134), `backport-*` (44).

Число веток сильно различается: не меньше 100 - в 8 из 25 репозиториев (ydb - 1998, datalens-backend - 646, cli - 641, ytsaurus - 453), не больше 5 - в 6 из 25 (userver - 4, yatool - 2, YaFSDP - 1). О том, удалять ли ветку после слияния, прочитанные документы проектов не говорят.

### Способ слияния

| Способ | Признак в истории | Репозитории | Доля (из 25) |
|---|---|---|---|
| Squash | заголовок заканчивается `(#N)` у ≥ 60 % коммитов людей | ch-tools 100 %, page-constructor 100 %, datalens 98,4 %, uikit 96,4 %, ydb-go-sdk 93,6 %, odyssey 85,1 %, ydb 76,1 %, mysync 74,3 %, yandex-ai-studio-sdk 64,5 % | 9 |
| Смешанно | `(#N)` у 20-60 % | cli 41,6 % и transform 28,2 % (squash и rebase); ydb-python-sdk 36,1 % (squash и merge-коммиты) | 3 |
| Rebase: каждый коммит PR попадает в историю | нет `(#N)`, нет merge-коммитов, история создана людьми | ytsaurus-ui (записано в README), ytsaurus-k8s-operator; у datalens-backend картина та же, но история, вероятно, синхронизируется из внутреннего git (не подтверждено) | 3 |
| Merge-коммиты | merge-коммитов ≥ 5 % | ydb-python-sdk 19,7 %, ydb 14,0 % (все - служебные слияния робота), tabred 9,7 % | 3 |
| Слияния нет: коммиты приходят из Аркадии | `commit_hash:` в 100 % коммитов | ytsaurus, catboost, userver, yatool, perforator, terraform-provider-yandex | 6 |

Строки пересекаются: ydb и ydb-python-sdk входят в две строки. Три репозитория не попали ни в одну: YaFSDP и pandora - частичные экспорты из Аркадии, graphland - исследовательский репозиторий с прямыми push в основную ветку. Сводный показатель: merge-коммитов нет вовсе в 19 из 25 репозиториев. В GitHub-first проектах слияние выполняется кнопкой в интерфейсе GitHub: доля коммитов с коммиттером `GitHub <noreply@github.com>` - 100 % у ch-tools и page-constructor, 99,7 % у uikit, 99,6 % у datalens, 88,3 % у odyssey; в зеркалах - 0 %.

Письменных упоминаний два, и они расходятся:

- YTsaurus UI: предпочитают rebase, а не squash; каждый коммит - небольшое логически законченное изменение; правки в PR вносятся интерактивным rebase - [README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md).
- YDB, гайд по ревью документации: после одобрения нажимается «Squash and merge» или включается auto-merge - [review.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md).

### Стабильные и релизные ветки

Имена проверены вручную по `git ls-remote --heads` (эвристика по именам даёт 15 из 25 репозиториев хотя бы с одной такой веткой, но содержит шум):

| Проект | Ветки | Назначение |
|---|---|---|
| YDB | `stable-26-3-1`, `stable-26-4-1`, `stable-…-hotfix`, `prestable-*` | минорные и hotfix-ветки сервера; по схеме есть и мажорные `stable-XX-Y` - [manage-releases.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/manage-releases.md) |
| YTsaurus | `stable/23.2` … `stable/26.2`; для CHYT - `chyt/<major>.<minor>` | релизные ветки, формат записан в [copilot-instructions.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/.github/copilot-instructions.md) |
| odyssey | `REL_1_5_1`, `REL_1_5_2`, `REL_1_6_0` | ветка на релиз |
| perforator | `release/0.1`, `release/0.2` | ветка на минорную версию |
| datalens-backend | `release/v0.2695.0` - 555 веток | ветка на каждый релиз |
| uikit | `v1` … `v5`, `release/v6` | поддержка прошлых мажорных версий |
| cli | `v4`, `v5`, `v6` | то же |
| ydb-go-sdk | `v2`, `release-3.42` … `release-3.55` | то же |
| userver | нет | исправления в старые релизы не переносятся - [releases.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/docs/en/userver/development/releases.md) |

### Что известно про ветки внутри Яндекса

- В монорепозитории действует trunk-based development: разработка в отдельных ветках не приветствуется, ветки допускаются для релизов - [Хабр, 2018](https://habr.com/ru/companies/yandex/articles/428972/).
- В Arc нельзя коммитить в основную ветку напрямую: изменение уходит на сервер, создаётся пул-реквест, после одобрения его вливает система. Ветки привязаны к пользователю, команды `merge` нет, слияния выполняет сервер - [Хабр, 2020](https://habr.com/ru/companies/yandex/articles/482926/) (пересказ доклада; состояние на начало 2020 года).
- userver называет свою модель Trunk-Based Development: все ревизии ветки `develop` побывали в продакшене - [releases.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/docs/en/userver/development/releases.md).

Интерпретация: формат YTsaurus `members/<user>/…` повторяет внутреннюю модель, где ветка принадлежит пользователю. Прямого подтверждения этой связи в источниках нет.

## Как зеркала Аркадии принимают внешние PR

Если проект - зеркало монорепозитория, кнопкой Merge его PR не сливают. По истории восстанавливается такой путь:

1. Контрибьютор открывает PR на GitHub. Проверки на собственных раннерах проекта стартуют только после того, как участник команды поставит метку `ok-to-test` (YDB, YTsaurus, Perforator).
2. После ревью изменение переносят во внутренний репозиторий. PR на GitHub при этом закрывается, а не сливается: YTsaurus прямо пишет, что одобренный PR документации закроет команда, а изменение опубликуется в течение недели - [yt/docs/README.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/yt/docs/README.md).
3. Изменение возвращается обычным коммитом синхронизации: автор сохранён, коммиттер - робот, в конце тела стоят разделитель `---`, строка `Pull Request resolved: <URL PR>` и `commit_hash:` - [catboost@968ecf3](https://github.com/catboost/catboost/commit/968ecf32c56252d2779fabfec4185ea512a8f12c).

Строка `Pull Request resolved:` встречается в 8 из 25 репозиториев: catboost - 9,7 % коммитов, userver - 7,0 %, pandora - 2,7 %, ytsaurus - 1,0 %, у остальных меньше 1 %. Публичного описания самого механизма синхронизации не найдено; о том, что внешние изменения userver переносились в Аркадию, упоминает [статья Яндекса о выходе в опенсорс](https://yandex.ru/jobs/blog/kak-vykhodyat-v-opensors) (2023).

YDB устроен иначе: это гибрид. Основная разработка идёт на GitHub (76,1 % коммитов людей - squash с `(#N)`), а общие каталоги (`/util`, `/library`, `/contrib`, `/build` и другие) приходят из Аркадии через ветку `rightlib`: ежедневный workflow открывает PR `rightlib → main` - [rightlib_sync.yml](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/.github/workflows/rightlib_sync.yml).

Для своего репозитория из этого раздела переносится только метка `ok-to-test` (Y-BR-008). Остальное имеет смысл, лишь когда источник истины - внутренний монорепозиторий.

## Выбор профиля

| Вопрос | Варианты в проектах Яндекса | Что берёт профиль и почему |
|---|---|---|
| Имя основной ветки | `main` - 15 из 25 · `master` - 8 · `develop`, `dev` - по 1 | **`main`**: большинство, включая ydb, ytsaurus, yatool и perforator |
| Способ слияния | squash - 9 из 25, назван в гайде YDB · rebase - YTsaurus UI, записано в README | **Squash по умолчанию.** Проверять нужно один заголовок PR (как в uikit), один PR даёт один коммит. Rebase допустим для команд, которые проверяют в CI каждый коммит. Merge-коммиты не используются: их нет в 19 из 25 |
| Имя рабочей ветки | `members/<user>/<описание>` (YTsaurus, записано) · `<type>/<описание>` (Gravity UI, наблюдение) · свободное имя в форке (YDB) | **Формат YTsaurus** для веток в общем репозитории: единственный записанный и, по словам проекта, проверяемый. В форке имя свободное |
| Стабильные ветки | `stable-…` и бэкпорты (YDB, YTsaurus) · релизы только из основной ветки (userver, библиотеки) | **По типу проекта**: библиотека и сервис - без стабильных веток; продукт с долгой поддержкой - со стабильными ветками. Критерий - в [releases.md](releases.md) |

Причин, по которым команды выбирают squash или rebase, публично никто не объяснял; выбор профиля основан на простоте проверки, а не на заявленной позиции Яндекса.

## Правила

### Y-BR-001 · SHOULD · Основная ветка называется `main`
- Проверка: `git symbolic-ref refs/remotes/origin/HEAD`; настройка «Default branch» репозитория.
- Источник: [измерение 25 репозиториев](../../research/yandex.md) (2026-10-09) · практика, выведенная из репозиториев (`main` - 15 из 25, `master` - 8, `develop` и `dev` - по 1) · высокая · реконструкция.

### Y-BR-002 · SHOULD · Разработка идёт по модели trunk-based: короткие рабочие ветки от основной, долгоживущих веток под отдельные функции нет
- Проверка: ручное ревью.
- Источник: [userver · Releases, Trunk-based Development and Pull Requests](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/docs/en/userver/development/releases.md) (HEAD 2026-10-09) · производный гайд проекта · средняя; [Хабр · статья о CI в монорепозитории, часть 1](https://habr.com/ru/companies/yandex/articles/428972/) (2018-11-08) · книга, статья или доклад · средняя (внутренняя практика, состояние на 2018 год).

### Y-BR-003 · MUST · В основную ветку изменения попадают только через PR или MR; прямой push закрыт
- Проверка: GitHub - правило «Require a pull request before merging»; GitLab - защищённая ветка с «Allowed to push and merge: No one» (перенос на GitLab - не Яндекс).
- Источник: [Хабр · статья об Arc](https://habr.com/ru/companies/yandex/articles/482926/) (2020-01-06) · книга, статья или доклад · средняя; [YDB · suggest-change.md, Review and merge](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · высокая. Уровень MUST взят из внутренней практики, где это ограничение системы; для git-репозитория это реконструкция · реконструкция.

### Y-BR-004 · SHOULD · Имя рабочей ветки в общем репозитории - `members/<user>/<short-description>`: строчные буквы, слова через дефис, описание до 30 символов
- Проверка: GitLab - Push rule «Branch name» с выражением `^(main|stable/.+|members/[a-z0-9-]+/[a-z0-9-]{1,30})$` (Premium и Ultimate; перенос на GitLab - не Яндекс); GitHub - ruleset с ограничением «Restrict branch names» либо ручное ревью. Выражение составлено по описанию правила и на сервере GitLab не проверялось.
- Источник: [ytsaurus/ytsaurus · copilot-instructions.md, Branch Naming Convention](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/.github/copilot-instructions.md) (2026-02-16) · производный гайд проекта · средняя. В YTsaurus формат обязателен; в профиле уровень понижен до SHOULD, потому что это правило одного проекта из 25. Наблюдаемые альтернативы - в [таблице выше](#имена-рабочих-веток).
- Пример:
  ```text
  # плохо
  Fix_Pagination
  members/ivanov/add-cursor-pagination-to-all-list-endpoints

  # хорошо
  members/ivanov/cursor-pagination
  ```

### Y-BR-005 · SHOULD · PR сливается без merge-коммита: по умолчанию squash, допустим rebase; история основной ветки линейная
- Проверка: GitHub - «Require linear history» и разрешённые способы слияния (squash, при необходимости rebase); GitLab - метод «Fast-forward merge» и «Squash commits when merging» (перенос на GitLab - не Яндекс).
- Источник: [YDB · documentation/review.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая; [ytsaurus/ytsaurus-ui · README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md) (HEAD 2026-10-09) · производный гайд проекта · средняя. Доля: merge-коммитов нет в 19 из 25; squash у ≥ 60 % коммитов - 9 из 25 · практика, выведенная из репозиториев (19 из 25) · высокая · реконструкция.

### Y-BR-006 · MUST · Заголовок PR или MR оформляется как заголовок коммита; описание называет связанный issue и то, что изменено
- Проверка: job «PR Title» с commitlint - см. [commits.md](commits.md#ci-github-и-gitlab); описание - шаблон PR и ручное ревью.
- Источник: [gravity-ui/uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · высокая; [gravity-ui/uikit · pr-title.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/pr-title.yml) (HEAD 2026-10-07) · конфиг или инструмент · высокая.

### Y-BR-007 · MUST · PR сливается только при зелёных обязательных проверках CI; проверки идут на результате слияния ветки с актуальной основной
- Проверка: GitHub - «Require status checks to pass before merging» с «Require branches to be up to date before merging»; GitLab - «Pipelines must succeed», для проверки результата слияния - merged results pipelines (Premium и Ultimate; перенос на GitLab - не Яндекс).
- Источник: [YDB · suggest-change.md, Precommit checks](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · высокая; [Хабр · NeuroReview](https://habr.com/ru/companies/yandex/articles/1089752/) (2026-10-07) · книга, статья или доклад · высокая (в Аркадии обязательные тесты и статический анализ идут до ручного ревью). Доля: сборка или тесты на `pull_request` - 19 из 25.

### Y-BR-008 · MUST · Если CI работает на собственных раннерах, для PR из форков он запускается только после метки `ok-to-test`, которую ставит участник команды
- Проверка: условие в workflow на событии `pull_request_target`; в GitLab метка не нужна - пайплайн MR из форка в родительском проекте запускает участник проекта (перенос на GitLab - не Яндекс, подробнее в [repository.md](repository.md#github-и-gitlab-различия-платформ)).
- Источник: [ydb-platform/ydb · pr_check.yml](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/.github/workflows/pr_check.yml) (HEAD 2026-10-09); [ytsaurus/ytsaurus · pr-check-is-allowed.yaml](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/.github/workflows/pr-check-is-allowed.yaml) (HEAD 2026-10-09); [yandex/perforator · precommit.yaml](https://github.com/yandex/perforator/blob/9ae889ad6be7/.github/workflows/precommit.yaml) (HEAD 2026-10-09) · конфиг или инструмент · высокая. Доля: 3 из 25 - все три проекта с собственными раннерами.

### Y-BR-009 · SHOULD · Нетривиальное изменение сначала обсуждается в issue; PR ссылается на этот issue
- Проверка: поле «Related issue» в шаблоне PR; ручное ревью.
- Источник: [ydb-platform/ydb · CONTRIBUTING.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/CONTRIBUTING.md) (HEAD 2026-10-09); [gravity-ui/uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08); [yandex/perforator · CONTRIBUTING.md](https://github.com/yandex/perforator/blob/9ae889ad6be7/CONTRIBUTING.md) (HEAD 2026-10-09) · производный гайд проекта · высокая. То же требование - у YTsaurus, CatBoost и ydb-go-sdk; у Perforator issue должен получить метку `accepted`.

### Y-BR-010 · SHOULD · Рабочая ветка обновляется через rebase на основную ветку; основная ветка в рабочую не вливается
- Проверка: ручное ревью; на GitHub - пункт «Update with rebase» в меню «Update branch» ([документация](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch)), в GitLab - кнопка «Rebase» и команда `/rebase` (не Яндекс).
- Источник: [YDB · suggest-change.md, Rebase changes](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · средняя; [ytsaurus/ytsaurus-ui · README.md](https://github.com/ytsaurus/ytsaurus-ui/blob/1e618927149b/README.md) (HEAD 2026-10-09) · производный гайд проекта · средняя. YDB описывает rebase как допустимый способ снять конфликт, а не как обязанность.

### Y-BR-011 · SHOULD · Стабильные ветки заводятся только у продукта, который пользователи разворачивают сами и долго не обновляют; библиотека и сервис выпускаются из основной ветки
- Проверка: ручное ревью; стабильные ветки защищаются тем же набором правил, что и основная (GitHub - шаблон `stable-*` в правиле; GitLab - защищённая ветка по маске).
- Источник: [YDB · manage-releases.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/manage-releases.md) (2026-08-03) · официальный гайд · высокая; [userver · releases.md](https://github.com/userver-framework/userver/blob/5fc4b311b0dc/scripts/docs/en/userver/development/releases.md) (HEAD 2026-10-09) · производный гайд проекта · высокая. Критерий выбора сформулирован авторами профиля · реконструкция.

### Y-BR-012 · SHOULD · Исправление сначала попадает в основную ветку, затем переносится в стабильную через `git cherry-pick` отдельным PR, который ссылается на исходный
- Проверка: ручное ревью; у YDB в чек-листе бэкпорта первым пунктом стоит ссылка на исходный PR в `main`.
- Источник: [YDB · suggest-change.md, Cherry-picking fixes to the stable branch](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23); [YDB · documentation/review.md, backport checklist](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая. YDB описывает это как порядок действий, без слова «обязательно», поэтому уровень - SHOULD.
- Пример:
  ```bash
  git fetch origin
  git checkout -b members/ivanov/backport-fix42 origin/stable-25-1
  git cherry-pick <хеш коммита из main>
  git push -u origin HEAD
  # затем PR или MR с целевой веткой stable-25-1 и ссылкой на исходный PR
  ```

## Настройки, которые обеспечивают правила

Точные значения в открытых репозиториях Яндекса не видны; таблица показывает, какой настройкой хостинга выражается каждое правило. Колонка GitLab - «перенос на GitLab - не Яндекс». Само требование защитить основную и стабильные ветки записано как [Y-REPO-017](repository.md).

| Правило | GitHub | GitLab |
|---|---|---|
| Y-BR-003 | «Require a pull request before merging» | Protected branch: «Allowed to merge: Developers + Maintainers», «Allowed to push and merge: No one» |
| Y-BR-005 | «Require linear history»; в правиле о PR - «Allowed merge methods»: squash (и rebase, если команда его использует) | Merge method «Fast-forward merge»; «Squash commits when merging: Require» или «Encourage» |
| Y-BR-006 | «Default commit message: Pull request title» в настройке squash | шаблон squash-сообщения `%{title}` (он же умолчание) |
| Y-BR-007 | «Require status checks to pass before merging» + «Require branches to be up to date before merging» | «Pipelines must succeed»; merged results pipelines - Premium и Ultimate |
| Y-BR-008 | условие в workflow по метке `ok-to-test` | участник проекта запускает пайплайн MR из форка вручную |
| Y-BR-004 | ruleset: «Restrict branch names» | Push rule «Branch name» - Premium и Ultimate |
| Y-CR-001, Y-CR-002 | число одобрений и «Require review from Code Owners» | Approval rules и «Require approval from code owners» - Premium и Ultimate |

Источники названий настроек: GitHub - [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [Creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), [Configuring commit squashing](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests); GitLab - [Protected branches](https://docs.gitlab.com/user/project/repository/branches/protected/), [Merge methods](https://docs.gitlab.com/user/project/merge_requests/methods/), [Commit message templates](https://docs.gitlab.com/user/project/merge_requests/commit_templates/), [Merged results pipelines](https://docs.gitlab.com/ci/pipelines/merged_results_pipelines/), [Push rules](https://docs.gitlab.com/user/project/repository/push_rules/). Все они - «не Яндекс».

## GitHub и GitLab: что отличается в процессе

| Тема | GitHub | GitLab (перенос - не Яндекс) |
|---|---|---|
| Линейная история при squash | «Squash and merge» создаёт один коммит в основной ветке | метод «Fast-forward merge» со squash: коммиты ветки сворачиваются в один и переносятся без merge-коммита; при методе «Merge commit» squash всё равно добавляет merge-коммит |
| Линейная история при rebase | «Rebase and merge» всегда переписывает коммиттера и создаёт новые хеши - [документация](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github) | при «Fast-forward merge» отставшую ветку нужно перебазировать кнопкой «Rebase» или локально |
| Ссылка на PR в заголовке коммита | `(#N)` дописывается к заголовку | умолчание шаблона - только заголовок MR; ссылку добавляют переменной `%{local_reference}` |
| Проверка результата слияния | «Require branches to be up to date before merging» или merge queue | merged results pipelines и merge trains - Premium и Ultimate |
| Ограничение имён веток | ruleset «Restrict branch names»; доступность зависит от тарифа | Push rule «Branch name» - Premium и Ultimate |

Остальные различия (`CODEOWNERS`, шаблоны, CI для форков) - в [repository.md](repository.md#github-и-gitlab-различия-платформ).

## Чего в профиле нет и почему

- Правил о времени жизни ветки и об удалении веток после слияния: публичных данных не найдено; в выборке у 8 из 25 репозиториев больше ста веток.
- Правил о размере PR: публичных данных не найдено - см. [code-review.md](code-review.md).
- GitFlow с ветками `develop` и `release/*` профиль не использует: `develop` у userver - имя основной ветки при trunk-based модели, а не ветка интеграции.
- Очереди слияния (merge queue, merge trains): в открытых репозиториях Яндекса следов не найдено; внутри известно только об автослиянии после закрытия замечаний - см. [code-review.md](code-review.md).
