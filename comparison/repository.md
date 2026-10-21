# Git и open source: Яндекс и Google

> Данные актуальны на 2026-10-09.

Главное различие - не в правилах, а в том, записаны ли они. У Google есть опубликованная процедура выпуска открытого проекта (документация Open Source Programs Office), гайд по код-ревью ([eng-practices](https://google.github.io/eng-practices/)) и гайд по Markdown; у Яндекса общекорпоративных правил для git-репозиториев нет, и профиль Яндекса целиком реконструирован по 25 открытым репозиториям и гайдам отдельных команд (YDB, Gravity UI, Diplodoc, YTsaurus). Самое заметное измеримое различие - заголовок лицензии в каждом файле: его требует Google и ставят 19 из 24 репозиториев выборки, а у Яндекса его нет ни в одном из 25. Второе - условия вклада: Google требует CLA во всех репозиториях и проверяет его ботом, Яндекс упоминает CLA в 13 из 25 репозиториев без автоматики, а три флагманских проекта от CLA отказались. В остальном открытые репозитории обеих компаний делятся на одни и те же два семейства: зеркала внутреннего монорепозитория (9 из 25 у Яндекса, 12 из 24 у Google) и проекты, живущие на GitHub, - и вторые у обеих компаний пользуются одним и тем же набором внешних соглашений: `CODEOWNERS`, squash-слияние, SemVer, Conventional Commits там, где релиз делает release-please. Сообщения коммитов - единственная тема, где профили на похожих данных приняли противоположные решения: Google - предложение-приказ с заглавной буквы без префикса, Яндекс - Conventional Commits. Ни одна из компаний не публикует материалов для GitLab; всё, что в профилях сказано о GitLab, - перенос.

Этот документ - часть сравнительного анализа: [философия и история](approach.md) · [код](code.md) · [«один код - два стиля»](examples.md) · [ML](ml.md) · [что взять для своего стека](choosing.md) · [глоссарий](glossary.md) · [оглавление](README.md). Полные отчёты с методом и выборками - [research/yandex.md](../research/yandex.md) и [google-codestyle/research/google.md](https://github.com/k1sur1n/google-codestyle/blob/main/research/google.md) (раздел C). Правила профилей, на которые здесь ссылаются по ID, лежат в `docs/git/` каждого репозитория - yandex-codestyle (`Y-…`) и google-codestyle (`G-…`).

## О доказательной базе: на что можно опираться

У двух сторон сравнения разный тип доказательств, и это важнее любого отдельного числа.

**Google: письменные правила плюс измеримая практика.** Документация OSPO ([Releasing](https://opensource.google/documentation/reference/releasing), обновлена 2025-06-10, CC BY 4.0) описывает обязательную для сотрудников процедуру выпуска открытого проекта; eng-practices (CC-BY 3.0, содержательная правка 2024-05-10) - ревью и описания изменений; [docguide](https://google.github.io/styleguide/docguide/) из google/styleguide - Markdown и README; шаблон [google/new-project](https://github.com/google/new-project) - образец репозитория из шести файлов. Поверх этого измерены 24 репозитория из 10 организаций (abseil, bazelbuild, google, googleapis, GoogleCloudPlatform, tensorflow, keras-team, jax-ml, google-deepmind, google-research) - 7 006 коммитов, по 300 последних на репозиторий - и три проекта на Gerrit (Go, Chromium, AOSP) по зеркалам. Поэтому для Google почти в каждом правиле профиля можно сказать две вещи: что написано и насколько это соблюдается. Расхождения между ними (дисклеймер, правообладатель, addlicense) разобраны ниже.

**Яндекс: реконструкция по 25 репозиториям.** Общего документа о репозиториях, коммитах, ветках, ревью или релизах у Яндекса нет; сайт [opensource.yandex](https://opensource.yandex/) перечисляет проекты, но правил не содержит. Письменные правила существуют только на уровне проектов: гайд YDB для участников, `contribute/pull-request.md` у Gravity UI, хук `commit-msg` у Diplodoc, README у YTsaurus UI, `copilot-instructions.md` у YTsaurus, `AGENTS.md` у userver. Измерены 25 репозиториев из 10 организаций (yandex, ydb-platform, ytsaurus, catboost, userver-framework, gravity-ui, diplodoc-platform, yandex-cloud, datalens-tech, yandex-research) - 6 602 коммита, из них 5 114 сделаны людьми. Отсюда следует, как читать профиль Яндекса: правило с пометкой «реконструкция» означает «так делает большинство проектов, живущих на GitHub, и это записано хотя бы у одного из них», а не «так требует Яндекс». Уровень MUST в профиле Яндекса стоит в основном там, где правило записано в проекте или проверяется инструментом; реконструированные по большинству правила - SHOULD. Доверие к такому правилу - среднее, и у каждого правила указана доля (например, «6 из 25»).

**Общие ограничения обоих измерений.** Пул-реквесты как объекты не измерялись: GitHub API был недоступен, поэтому число ревьюеров, время до слияния и доля внешних PR неизвестны для обеих компаний. Настройки защиты веток без прав администратора не видны; у Google они лежат в репозитории как код в 3 из 24 случаев, у Яндекса выведены из текстов проектов. Ни одно измерение не говорит о внутренних системах (Аркадия, Piper): о них известно только из статей и книги, и это разобрано в [approach.md](approach.md) и [glossary.md](glossary.md).

**Два семейства в каждой выборке.** 9 из 25 репозиториев Яндекса несут файл `.mapping.json` (карта путей в Аркадию), 6 из 25 - трейлер `commit_hash:` в каждом коммите; 12 из 24 репозиториев Google - односторонний экспорт через Copybara с трейлером `PiperOrigin-RevId`. В зеркалах PR не сливают кнопкой, рабочих веток нет, коммитят роботы. Оба профиля сознательно строятся по второму семейству - проектам, которые ведутся на GitHub, - потому что только их практики воспроизводимы без внутреннего монорепозитория. Это общая методическая рамка, и ниже доли для «всей выборки» и для «GitHub-половины» различаются там, где это существенно.

## 1. Обязательные файлы и структура репозитория

**Вывод.** Минимум совпадает - `README`, `LICENSE`, `.gitignore`, `CONTRIBUTING` есть почти везде у обеих компаний, - но у Google он записан (OSPO называет `LICENSE` и `CONTRIBUTING` обязательными, README - минимально нужным), а у Яндекса выведен из долей. Файлы сообщества (`SECURITY.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS`, шаблоны) у Яндекса сосредоточены во флагманах и встречаются в 7 из 25 репозиториев, у Google - чаще, причём Google закрывает часть из них на уровне организации через репозиторий [google/.github](https://github.com/google/.github), откуда GitHub подставляет файлы во все проекты.

| Файл или практика | Яндекс (из 25) | Google (из 24) | Правила |
|---|---|---|---|
| `README.md` в корне | 25 (все на английском) | 24 | [Y-REPO-001](../docs/git/repository.md), [G-DOC-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `LICENSE` в корне | 25 | 24 | [Y-REPO-002](../docs/git/repository.md), [G-REPO-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `CONTRIBUTING.md` | 19 | 24 | [Y-REPO-006](../docs/git/repository.md), [G-REPO-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `.gitignore` | 24 | 23 | [Y-REPO-005](../docs/git/repository.md), [G-REPO-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `CODE_OF_CONDUCT.md` | 7 | 8 в репозитории; 18 с учётом файла организации | [Y-REPO-009](../docs/git/repository.md), [G-REPO-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `SECURITY.md` | 7 | 11 в репозитории; 20 с учётом файла организации | [Y-REPO-009](../docs/git/repository.md), [G-REPO-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Файл changelog | 9 (`CHANGELOG.md` в корне) | 13 (из них автоматический - 4) | [Y-REL-008](../docs/git/releases.md), [G-REL-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md) |
| `CODEOWNERS` | 7 (в корне - 4, в `.github/` - 3) | 9 | [Y-REPO-013](../docs/git/repository.md), [G-REPO-020](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Шаблон PR | 9 | 11 | [Y-REPO-014](../docs/git/repository.md), [G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Шаблоны issue | 6 (YAML-формы - 4, Markdown - 2) | 13 (YAML-формы - 7, только Markdown - 6) | [Y-REPO-015](../docs/git/repository.md), [G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `AUTHORS` или `CONTRIBUTORS` | 12 | 11 | - / [G-REPO-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| `.editorconfig` | 5 | 4 | [Y-REPO-012](../docs/git/repository.md) / у Google правила нет |
| `.pre-commit-config.yaml` | 1 | 6 | см. тему 7 |
| Dependabot или Renovate | 8 | 15 | см. тему 7 |
| `.gitlab-ci.yml` или `.gitlab/` | 0 | 0 (из 25, включая шаблон) | см. тему 9 |

Что стоит за таблицей. У Google есть эталон - `google/new-project`: `README.md`, `LICENSE`, `docs/contributing.md`, `docs/code-of-conduct.md`, шаблон PR и шаблон сообщения об ошибке. В нём нет `SECURITY.md`, `CODEOWNERS`, `.gitignore`, changelog и CI; политика безопасности и кодекс поведения приходят из репозитория организации. Практика при этом богаче шаблона: `CODEOWNERS`, YAML-формы issue и Dependabot в письменных правилах Google не упомянуты вовсе, поэтому соответствующие правила профиля ([G-REPO-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-020](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) помечены как реконструкция.

У Яндекса эталона нет, но есть повторяющиеся образцы, которые команды копируют друг у друга. Все семь `SECURITY.md` написаны по одной схеме - куда и когда сообщать, ответ за 5 рабочих дней, раскрытие в срок от немедленного до 90 дней ([пример YDB](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/SECURITY.md)). Шесть из семи `CODE_OF_CONDUCT.md` состоят из одной строки со ссылкой на CONTRIBUTING, и только ydb-go-sdk хранит полный текст (Contributor Covenant 1.4). `CONTRIBUTING.md` YDB, YTsaurus и CatBoost построены по одному плану с заголовком «Notice to external contributors». `CODEOWNERS` встречается в трёх видах: команды по каталогам (YDB, 271 строка), мейнтейнеры плюс владелец на каждый компонент (Gravity UI uikit), одна строка на весь репозиторий (Diplodoc).

Шаблоны issue - показательная мелочь. У Google письменный образец (new-project) - Markdown, а практика ушла к YAML-формам (7 из 24); профиль Google остаётся на Markdown, потому что это записанный образец, и он почти без изменений переносится в GitLab ([G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)). У Яндекса письменного образца нет, самый подробный набор форм - YAML у Gravity UI и Diplodoc с отключёнными пустыми issue; профиль Яндекса берёт YAML-формы ([Y-REPO-015](../docs/git/repository.md)), и в GitLab-варианте их приходится переписывать в Markdown.

Интерпретация: разница в полноте файлов сообщества не говорит о разном отношении к сообществу - она следует из того, что у Google есть организационный уровень (`google/.github`) и письменный чек-лист выпуска, а у Яндекса каждая команда решает сама. Там, где у Яндекса команда решила (YDB, Gravity UI), набор файлов не беднее, чем у Google.

## 2. Лицензии, CLA и DCO, заголовки в файлах, сторонний код, дисклеймеры

**Вывод.** Лицензии почти одинаковы (Apache-2.0 преобладает у обеих), а всё остальное в этой теме различается, и различается принципиально: Google оформляет права на уровне файла и каждого внешнего участника (заголовок в каждом исходнике, CLA с ботом), Яндекс - на уровне репозитория (один `LICENSE`, CLA без автоматики, а у флагманов - вовсе без CLA). DCO не использует ни одна из компаний.

**Лицензии.** Яндекс: Apache-2.0 - 16, MIT - 6, MPL-2.0 - 2, BSD-3-Clause - 1 из 25. Google: Apache-2.0 - 19, BSD-3-Clause - 4, MIT - 1 из 24. У Google Apache-2.0 - записанное умолчание OSPO, другую лицензию выбирают по причине ([G-REPO-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)). У Яндекса правило выведено из экосистемы: npm-пакеты выходят под MIT, серверные продукты и SDK - под Apache-2.0, производные проекты сохраняют лицензию исходного ([Y-REPO-003](../docs/git/repository.md), реконструкция). Полный текст лицензии в `LICENSE` требуют оба профиля ([Y-REPO-002](../docs/git/repository.md), [G-REPO-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)).

**Заголовки лицензии в файлах.** Это самая резкая граница между двумя практиками.

| Показатель | Яндекс | Google |
|---|---|---|
| Репозитории с заголовком в собственных исходниках | 0 из 25 | 19 из 24 (заголовок в 9-10 из 10 случайных файлов); ни одного заголовка - 2 (keras, pyink) |
| Письменное правило | нет | OSPO: заголовок с копирайтом и лицензией в каждом исходном файле - «must» |
| Правообладатель в заголовке | - | «The [Project] Authors» - 11, «Google LLC» - 5, «Google Inc.» - 5, «DeepMind» - 1 (optax) из 24; без заголовков - 2 (keras, pyink) |
| Автоматическая проверка | - | 7 из 24 (бот - 4, собственные скрипты - 3); рекомендованный OSPO `addlicense` не запускает ни один из 25 |
| Правила профиля | [Y-REPO-004](../docs/git/repository.md): заголовок не добавляется | [G-REPO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)…[G-REPO-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |

У Яндекса копирайт фиксируется один раз в `LICENSE`, и это устойчиво: ни зеркала Аркадии, ни GitHub-проекты пофайловых заголовков не ставят. У Google требование юридическое и написано именно для внешних репозиториев; примечательно, что собственные стайлгайды Google говорят обратное - C++ Style Guide сообщает, что новые файлы обычно не содержат копирайта и строки автора. Профиль Google разрешает конфликт в пользу OSPO: стайлгайд описывает внутреннюю кодовую базу, а правило о заголовках - внешние репозитории. Год в строке копирайта - год создания файла, при правках его не обновляют ([G-REPO-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)).

**CLA и DCO.**

| Показатель | Яндекс (из 25) | Google (из 24) |
|---|---|---|
| CLA упомянут в README, CONTRIBUTING или шаблонах | 13 | 22 (с учётом ссылок - 24) |
| Автоматическая проверка CLA | 0 из 22 репозиториев с GitHub Actions | обязательный статус `cla/google` |
| Письменное требование DCO | 0 | 0 |
| `Signed-off-by` в ≥ 50 % коммитов | 2 (odyssey, ytsaurus-k8s-operator) | 0 |
| Правила профиля | [Y-REPO-007](../docs/git/repository.md), [Y-REPO-008](../docs/git/repository.md) | [G-REPO-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-023](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-GIT-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |

CLA Яндекса ([yandex.ru/legal/cla](https://yandex.ru/legal/cla/?lang=en), редакция 2024-10-04) «подписывается» фразой в описании первого PR; бота нет. При этом три флагмана от CLA отказались: YTsaurus и YDB в 2024 году, CatBoost - 2025-08-02 ([коммит](https://github.com/catboost/catboost/commit/fd18a8a9d3)); причины публично не объяснены, вклад принимается под лицензией проекта. Профиль Яндекса берёт именно этот вариант ([Y-REPO-007](../docs/git/repository.md)): CLA Яндекса заключается с Yandex LLC и к чужому проекту неприменим. У Google CLA - лицензия, а не передача прав; его требуют все репозитории выборки, статус бота блокирует слияние, а тот, кто сливает PR, обязан убедиться, что проверка пройдена ([G-REPO-023](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)). DCO в документах Google не упоминается; `Signed-off-by` требует только AOSP (`git commit -s`), Go его прямо запрещает - профиль Google не использует его без DCO ([G-GIT-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md)). У Яндекса `Signed-off-by` стоит в большинстве коммитов двух репозиториев без какого-либо письменного требования - профиль его не требует ([Y-REPO-008](../docs/git/repository.md)).

**Сторонний код.** Google: `third_party/<библиотека>/` в корне с собственным `LICENSE` у каждой библиотеки - «must» с исключениями для форков, экосистем с другим соглашением и зависимостей из пакетного менеджера ([G-REPO-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)); в выборке `third_party/` в корне - 6 из 24, где-либо в дереве - 8. Плюс список допустимых лицензий зависимостей: AGPL, SSPL, OSL, BUSL, некоммерческие лицензии и Commons Clause в него не входят ([G-REPO-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)). Яндекс: чужой код лежит в `contrib/` (C, C++, Python - 5 репозиториев) и `vendor/` (Go - 5), `third_party/` - только у userver (1); 18 из 25 репозиториев чужой код в дерево не кладут вовсе. Раскладка `contrib/` унаследована от Аркадии, где лицензия стороннего кода обязательна (макрос `LICENSE(...)` в `ya.make`, [license.conf](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/conf/license.conf#L20-L30)), а его линтинг отключается - отсюда правила [Y-REPO-010](../docs/git/repository.md) и [Y-REPO-011](../docs/git/repository.md). Списка запрещённых лицензий у Яндекса публично не найдено.

**Дисклеймеры и терминология.** OSPO требует для неофициальных проектов дисклеймер; в выборке он найден в 8 из 24 README, причём точная формулировка «not an officially supported Google product» - в одном (pyink), остальные семь пишут «not an official Google product». Профиль Google превращает это в SHOULD о статусе поддержки ([G-REPO-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)): фраза о продукте Google в чужом проекте неприменима. У Яндекса аналогичного дисклеймера в источниках нет - публичных данных не найдено. Инклюзивная терминология ([G-REPO-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)): OSPO пишет, что новым проектам «следует избегать» пар master/slave и whitelist/blacklist, C++ Style Guide формулирует жёстче, Chromium - как предложение; на имена веток правило задним числом не распространилось - 9 из 24 репозиториев Google остаются на `master`. У Яндекса правила о терминологии - публичных данных не найдено.

Интерпретация: обе компании решают одну задачу - чтобы код можно было безопасно использовать и принимать вклад, - но Google делает это процедурой, рассчитанной на тысячи репозиториев и внешних авторов (заголовок в каждом файле переживает копирование файла, бот CLA не зависит от внимательности мейнтейнера), а Яндекс - доверием к контексту репозитория. Для обычного проекта второй путь дешевле, первый - надёжнее при активном внешнем вкладе; выбор разобран в [choosing.md](choosing.md).

## 3. Сообщения коммитов

**Вывод.** Единого формата нет ни у одной из компаний, и обе выборки показывают одно и то же: Conventional Commits живёт ровно там, где релизы делает release-please (5 из 25 у Яндекса, 4 из 24 у Google), а в остальных репозиториях заголовки - свободные повелительные фразы. Профили при этом разошлись. У Google есть общий письменный документ о содержании сообщения (eng-practices) и рекомендованная форма (cbea.ms), поэтому профиль Google берёт «предложение-приказ с заглавной буквы, без точки, до 72 символов» и оставляет Conventional Commits для репозиториев с release-please. У Яндекса единственный формат, который записан, проверяется и питает релиз, - Conventional Commits у Gravity UI, Diplodoc и YTsaurus UI, поэтому профиль Яндекса берёт его по умолчанию.

**Что написано.** Google: eng-practices, раздел [«Writing good CL descriptions»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html) - первая строка как короткий приказ, пустая строка, тело «что и почему», плохие примеры («Fix bug», «Phase 1»); чисел длины там нет. Форму - 50/72, заглавная буква, без точки - даёт сторонняя статья [cbea.ms/git-commit](https://cbea.ms/git-commit/), на которую README google/styleguide ссылается с 2025-01-17. Go, Chromium, AOSP и Angular держат собственные форматы с трейлерами Gerrit (`Change-Id`, `Bug:`, `Test:`). Яндекс: единственные письменные правила - `contribute/pull-request.md` Gravity UI (заголовок PR по Conventional Commits, проверяет commitlint), хук Diplodoc (английский язык, список типов с `deps`), README YTsaurus UI (каждый коммит PR по Conventional Commits, описание со строчной буквы, ключ тикета `[YTFRONT-N]`); гайд YDB формата не задаёт, а требований к сообщениям внутри Аркадии публично не найдено.

**Что измерено.**

| Показатель | Яндекс (25 репозиториев, 5 114 коммитов людей) | Google (24 репозитория, 7 006 коммитов) |
|---|---|---|
| Сообщения на английском | кириллицы нет вовсе - 15 из 25; ≥ 5 % заголовков с кириллицей - 4 (все зеркала Аркадии) | 24 из 24; кириллицы нет ни в одном сообщении |
| Медиана длины заголовка | 47,5 символа (по 22 репозиториям) | 56 символов |
| 90-й перцентиль длины | 71 | 84 |
| Заголовков длиннее 72 символов | медиана по репозиториям 8,5 %; в общем пуле 11,1 % | в среднем 22,8 %; более четверти заголовков длиннее 72 - в 12 из 24 |
| Conventional Commits в подавляющем большинстве коммитов | ≥ 97 % - 6 из 25 | ≥ 95 % - 5 из 24 (≥ 60 % - 7) |
| Conventional Commits почти не используется | < 20 % - 18 из 25 | 0-9 % - 17 из 24 |
| Заголовок с заглавной буквы | ≥ 70 % коммитов - 10 из 25; ≤ 30 % - 10 | в среднем 61,6 % (экспорт - 86,2 %, GitHub-половина - 37,0 %) |
| Точка в конце заголовка | ≥ 5 % коммитов - 1 из 25 (catboost) | ≥ 30 % коммитов - 12 из 24 (guava - 91 %) |
| Непустое тело у ≥ 50 % коммитов | 11 из 25 | 10 из 24 |
| `Signed-off-by` в ≥ 50 % коммитов | 2 из 25 | 0 из 24 |
| Формат записан или проверяется автоматикой | 5 из 25 (commitlint - 2, свой хук - 2, регулярное выражение в CI - 1) | 0 из 24 конфигов commitlint; в googleapis - внешний бот, объявлен устаревшим |
| Трейлер экспорта из монорепозитория | `commit_hash:` в 100 % коммитов - 6 из 25 | `PiperOrigin-RevId` - 12 из 24 |

Две разницы заметны сразу. Первая - точка в конце заголовка: у Google она стоит в 12 из 24 репозиториев (внутренний стиль законченного предложения, экспортированный из монорепозитория: abseil-cpp, guava, re2, leveldb), у Яндекса практически не встречается. Профиль Google всё же берёт вариант без точки ([G-GIT-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md)): он совпадает с cbea.ms, Go, Angular и Conventional Commits и проверяется инструментом. Вторая - длина: заголовки Яндекса короче (медиана 47,5 против 56), и предел 72 в профиле Яндекса лежит ровно на 90-м перцентиле выборки ([Y-GIT-006](../docs/git/commits.md)); у Google тот же предел 72 ([G-GIT-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md)) мягче практики - в 12 из 24 репозиториев более четверти заголовков длиннее.

**Как выглядят сообщения.** Реальные заголовки из историй (ссылки на коммиты - в `commits.md` [Яндекса](../docs/git/commits.md) и [Google](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md)):

```text
# Яндекс, стиль профиля - Conventional Commits (gravity-ui/uikit, ytsaurus/ytsaurus-ui)
feat(Dialog): add disableTransition prop (#2855)
fix(TextInput): fix clear button styles
feat(CHYT): configure CPU and memory when creating a clique [YTFRONT-6086]

# Яндекс, зеркало Аркадии - в профиль не перенесено (ytsaurus/ytsaurus)
YT-29880: Fix zero TabletSize bug
commit_hash:25a040c8ea017b48c87ec0a1878a256377a70939
```

```text
# Google, формат профиля по умолчанию (keras-team/keras)
Support io.IOBase in keras.saving.load_model (#23873)

# Google, внутренний стиль с точкой - экспорт из монорепозитория (abseil/abseil-cpp)
Include cord.h directly from status.cc.

# Google, вариант Conventional Commits для release-please (googleapis/google-cloud-go)
fix(spanner): disable DirectPath fallback by default (#20648)
```

Полная пара «одно изменение - два сообщения и два описания PR» с разбором - в [examples.md](examples.md).

**Куда ведут правила профилей.**

| Параметр | Яндекс | Google |
|---|---|---|
| Формат заголовка | `<type>(<scope>): <описание>`, типы из `@commitlint/config-conventional` - [Y-GIT-002](../docs/git/commits.md), [Y-GIT-003](../docs/git/commits.md) | предложение-приказ без префикса - [G-GIT-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md); Conventional Commits только с release-please - [G-GIT-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Первая буква, точка | строчная, без точки - [Y-GIT-005](../docs/git/commits.md) | заглавная, без точки - [G-GIT-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Предел длины | 72, ориентир 50 - [Y-GIT-006](../docs/git/commits.md) | 72, ориентир 50 - [G-GIT-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md); для варианта Conventional Commits оставлен предел пресета 100 |
| Язык | английский, MUST, проверяется хуком на кириллицу - [Y-GIT-001](../docs/git/commits.md) | английский, SHOULD, письменного правила нет - [G-GIT-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Ссылка на задачу | в конце заголовка в квадратных скобках: `[PROJ-123]`, `[#123]` - [Y-GIT-008](../docs/git/commits.md) | трейлером в последнем абзаце: `Fixes #N`, `Updates #N`, для внешнего трекера `Bug: ABC-123` - [G-GIT-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Тело | пустая строка, «что и зачем», как проверено - [Y-GIT-009](../docs/git/commits.md) | пустая строка (MUST), «что и почему», перенос на 72 - [G-GIT-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Несовместимое изменение | `!` или `BREAKING CHANGE:` - [Y-GIT-010](../docs/git/commits.md) | то же, но только в варианте Conventional Commits - [G-GIT-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Трейлеры | только общепринятые; `commit_hash:` вручную не пишут - [Y-GIT-012](../docs/git/commits.md) | только те, что читает инструмент; `PiperOrigin-RevId` не переносится - [G-GIT-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Проверка | хук `commit-msg` плюс job в CI; при squash - по заголовку PR - [Y-GIT-013](../docs/git/commits.md) | commitlint (не Google): конфиг профиля без пресета для формата по умолчанию; заголовок PR - [G-GIT-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |

Обратите внимание на ссылку на задачу: это единственное место, где форматы несовместимы. Яндекс кладёт ключ тикета в заголовок - так делают YTsaurus UI (`[YTFRONT-6084]`), datalens-backend и зеркала (`YT-29880:`); у Google ссылка уходит в футер, как у Go (`Fixes #N`) и Chromium (`Bug: N`). Интерпретация: у Яндекса заголовок исторически привязан к трекеру (Startrek-ключи `YT-`, `BI-`, `YTFRONT-` видны во всей выборке), у Google - к системе ревью, где футеры читает Gerrit или GitHub.

Интерпретация итога по теме: обе компании получили Conventional Commits из одного источника - его спецификация выросла из правил коммитов Angular, а release-please (проект googleapis) читает именно этот формат, - и обе применяют его как «формат для инструмента», а не как общий стандарт. Профиль Яндекса сделал его умолчанием не потому, что Яндекс так решил, а потому что это единственный записанный и проверяемый формат в выборке; авторы профиля прямо называют это своим выбором. Для команды, которая выбирает между профилями, практическая разница сводится к одному вопросу: будет ли changelog собираться из истории ([choosing.md](choosing.md)).

## 4. Ветки и процесс PR/MR

**Вывод.** Здесь профили почти совпадают, потому что обе компании внутри работают в монорепозитории по модели trunk-based и в git воспроизводят её одними и теми же настройками хостинга: защищённая основная ветка, короткие рабочие ветки, слияние через PR одним коммитом, обязательные проверки до слияния. Разница - в источниках: у Google модель описана в книге «Software Engineering at Google» (гл. 16) и в порогах DORA, у Яндекса - в двух статьях сотрудников на Хабре (2018 и 2020) и в документах трёх проектов. Единственное содержательное расхождение - имена рабочих веток: Яндекс в лице YTsaurus записал схему `members/<user>/<описание>`, Google схему не публикует.

**Что измерено.**

| Показатель | Яндекс (из 25) | Google (из 24) |
|---|---|---|
| Основная ветка `main` / `master` | 15 / 8 (ещё `develop` - userver, `dev` - pandora) | 14 / 9 (у pyink - `pyink`) |
| Долгоживущая ветка разработки | основная ветка называется `develop` у userver и `dev` у pandora (2); userver при этом называет модель trunk-based | веток `develop`, `dev`, `staging`, `next` нет ни в одном (24); особые долгие ветки - `preview` (google-cloud-go, google-cloud-python), `nightly` (tensorflow) |
| Merge-коммитов нет вовсе | 19 | 14 (≥ 5 % - в 8, из них 7 - экспортируемые репозитории, куда внешний PR приходит merge-коммитом импорта) |
| Squash: суффикс `(#N)` у ≥ 60 % коммитов | 9 | 9 (в GitHub-половине - в среднем 79 % коммитов, в экспорте - 4 %) |
| Релизные или стабильные ветки | у серверных продуктов: YDB `stable-26-3-1`, YTsaurus `stable/26.2`; у библиотек - `v5`, `release/v6` | 11; имена разные: `lts_YYYY_MM_DD` (abseil-cpp), `rX.Y` (tensorflow, keras), `release/X.Y.Z` (jax), `12.x` (release-please) |
| Настройки защиты ветки видны как код | 0 (выведены из текстов) | 3 (`sync-repo-settings.yaml`): merge-коммиты запрещены, одно одобрение, одобрение владельцев кода, обязательные проверки |
| Письменное правило о способе слияния | 2, и они расходятся: squash - гайд YDB по документации; rebase - README YTsaurus UI | CONTRIBUTING требует squash - 4 (google-cloud-go, go-github и другие); README release-please объясняет, зачем линейная история |

**Что записано.** Google: trunk-based development как внутренняя практика - книга, гл. 16 (долгоживущая ветка разработки есть меньше чем у 10 команд примерно из 1000; незавершённое выключают флагом; релизные ветки обратно не сливаются); измеримые пороги - DORA (не больше трёх активных веток, слияние не реже раза в день); для GitHub - требование ревью для всех изменений в шаблоне new-project и защита основных веток в документе OSPO о GitHub Actions. Размер изменения - eng-practices, «Small CLs»: около 100 строк, 1000 - обычно слишком много. Яндекс: в Аркадии «разработка в отдельных ветках не приветствуется, ветки допускаются для релизов» ([Хабр, 2018](https://habr.com/ru/companies/yandex/articles/428972/)); в Arc коммитить в основную ветку напрямую нельзя, ветки привязаны к пользователю, слияние выполняет сервер ([Хабр, 2020](https://habr.com/ru/companies/yandex/articles/482926/)); userver называет свою модель trunk-based и пишет, что все ревизии `develop` побывали в продакшене; YTsaurus требует имя ветки `members/<user>/<short-description>` и пишет, что формат обеспечен правилом защиты (200 из 453 веток начинаются с `members/`); YDB описывает путь PR от форка до слияния участником команды и бэкпорт в стабильную ветку отдельным PR.

**Куда ведут правила.** Оба профиля: `main` ([Y-BR-001](../docs/git/branches.md), [G-BR-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), trunk-based ([Y-BR-002](../docs/git/branches.md), [G-BR-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md), [G-BR-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), прямой push закрыт - MUST у обоих ([Y-BR-003](../docs/git/branches.md), [G-BR-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), squash и линейная история ([Y-BR-005](../docs/git/branches.md), [G-BR-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), зелёные обязательные проверки поверх актуальной основной ветки ([Y-BR-007](../docs/git/branches.md), [G-BR-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), стабильная ветка только для поддержки выпущенной версии, исправление сначала в `main`, затем cherry-pick ([Y-BR-011](../docs/git/branches.md), [Y-BR-012](../docs/git/branches.md), [G-BR-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)). Отличия: у Яндекса есть правило об имени ветки ([Y-BR-004](../docs/git/branches.md)) и о метке `ok-to-test` для PR из форков на собственных раннерах ([Y-BR-008](../docs/git/branches.md) - так делают YDB, YTsaurus и Perforator); у Google - о размере изменения ([G-BR-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), отдельном рефакторинге ([G-BR-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)), флагах для незавершённой работы ([G-BR-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)) и удалении ветки после слияния ([G-BR-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)). Размер PR у Яндекса публично не описан, и профиль Яндекса берёт правило из eng-practices с пометкой «не Яндекс» ([Y-CR-015](../docs/git/code-review.md)).

**Как зеркала монорепозитория принимают внешний вклад.** У обеих компаний механизм один и тот же, только трейлеры разные.

| Шаг | Яндекс (зеркала Аркадии: 6 из 25 с `commit_hash:`, 9 с `.mapping.json`) | Google (экспорт через Copybara: 12 из 24 с `PiperOrigin-RevId`) |
|---|---|---|
| Контрибьютор открывает PR на GitHub | да; CI на собственных раннерах - после метки `ok-to-test` | да |
| Где проходит ревью | снаружи ревью есть, затем изменение переносят в Аркадию; PR закрывается, а не сливается (YTsaurus так и пишет про документацию: опубликуется в течение недели) | PR импортируют во внутренний репозиторий, и настоящее ревью проходит там |
| Как изменение возвращается | коммитом синхронизации с сохранённым автором, коммиттер - робот; в теле `---`, `Pull Request resolved: <URL>` (встречается в 8 из 25 репозиториев), `commit_hash:` (в каждом коммите - 6 из 25) | коммитом экспорта с `PiperOrigin-RevId`; в 7 экспортируемых репозиториях внешний PR приходит merge-коммитом импорта |
| Что видно в истории | роботы `robot-piglet` («Intermediate changes»), `robot-contrib`; вычищенные номера ревизий `rXXXXXX` | трейлер в большинстве коммитов; CI часто живёт внутри компании |
| Гибрид | YDB: основная разработка на GitHub, общие каталоги приходят из Аркадии через ветку `rightlib` ежедневным PR | - |
| Публичное описание механизма | не найдено; о переносе внешних изменений userver в Аркадию упоминает [статья Яндекса](https://yandex.ru/jobs/blog/kak-vykhodyat-v-opensors) (2023) | инструмент экспорта - Copybara; JAX и Flax просят один коммит на PR, потому что PR импортируется внутрь |

Пример коммита, вернувшегося из Аркадии после внешнего PR ([catboost@968ecf3](https://github.com/catboost/catboost/commit/968ecf32c56252d2779fabfec4185ea512a8f12c)):

```text
Document fit() callbacks parameter (#2393)

Closes #2393

---

Pull Request resolved: https://github.com/catboost/catboost/pull/3200

Co-authored-by: stohirov <95065111+stohirov@users.noreply.github.com>
commit_hash:5b20ba337f846ff42d2b865a824c15f3883e3b5d
```

Интерпретация: для стороннего контрибьютора зеркала обеих компаний ведут себя одинаково - PR читают люди, но «кнопки Merge» нет, и срок попадания изменения в публичную ветку зависит от внутреннего цикла. Оба профиля сознательно ничего из этой механики не переносят, кроме метки `ok-to-test` у Яндекса: она защищает собственные раннеры от чужого кода и полезна любому проекту с self-hosted CI.

## 5. Код-ревью

**Вывод.** Это тема с самым большим разрывом в письменных источниках. У Google есть полный публичный гайд ревьюера и автора - [Code Review Developer Guide](https://google.github.io/eng-practices/review/) из eng-practices (опубликован 2019-09-05, правки до 2024-05-10), - и это экспорт внутреннего документа: README объясняет внешнему читателю внутренние термины CL и LGTM. У Яндекса общего регламента ревью нет; известны правила трёх проектов (YDB, Gravity UI, библиотека `util`), декларативная схема ревью в файлах `a.yaml` Arcanum, попавших наружу вместе с `yandex/yatool`, и статья 2026 года об ИИ-ревью. Поэтому профиль Google - 18 правил о том, *как* ревьюить (стандарт, скорость, тон, споры), профиль Яндекса - 15 правил о том, *кто и когда* одобряет (владельцы, сроки, заброшенные PR, откаты); о тоне и спорах профиль Яндекса отсылает к eng-practices с пометкой «не Яндекс».

**Что известно о внутреннем ревью.**

| Вопрос | Яндекс (Arcanum) | Google (Critique) |
|---|---|---|
| Где записаны правила | в `a.yaml` каталога: `auto_assign`, `min_approvers_count`, группы ревьюеров, `rules.subpaths`, условия `auto_merge` ([cpp_style/a.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml)); документации схемы публично нет, трактовка полей выведена из трёх файлов | файлы `OWNERS` по каталогам (права складываются вверх по дереву) и гайд eng-practices; книга, гл. 9 |
| Сколько одобрений | `min_approvers_count: 1` в примерах; единого числа публично не найдено | три одобрения: LGTM коллеги, одобрение владельца из `OWNERS`, одобрение носителя readability; часто их даёт один человек, чужим обязано быть только первое |
| Кто владеет конфигами стиля | «комитеты» по языкам: `.clang-format` ревьюит `cppcommittee`, `ruff.toml` - Python Committee | отдельно не описано; владение задаётся файлами `OWNERS` по каталогам |
| Регламент сроков | `util`: напомнить через один-два рабочих дня, запрос заброшен через три месяца; YDB (документация): итерация - два рабочих дня | eng-practices: первый ответ не позже чем через один рабочий день; статья 2018 года: первый ответ на небольшое изменение - в пределах часа, всё ревью - меньше четырёх часов по медиане |
| Автоматика до ревью | 2018: прекоммитные проверки добровольны; 2026: обязательные тесты и статический анализ, затем ручное ревью; NeuroReview комментирует через 2-3 минуты, около 4 тысяч PR в день, принимается около 30 % замечаний | presubmit-проверки и статический анализ с готовыми исправлениями в инструменте ревью; книга называет замечания о форматировании плохой тратой времени ревьюера |
| Сертификация ревьюера | аналога readability - публичных данных не найдено | readability: сертификация по языку, в процессе около 20 % инженеров, ревьюеров - 1-2 %; действует только внутри монорепозитория |

**Что показывают открытые репозитории.** Яндекс: `CODEOWNERS` - 7 из 25, шаблон PR - 9; письменного требования «N одобрений» нет ни в одном проекте; фактический минимум - одобрение участника команды (YDB) или всех вызванных владельцев кода (Gravity UI uikit); у Diplodoc PR ботов одобряет служебная учётная запись после зелёного CI; у page-constructor `CHANGELOG.md` и `package.json` оставлены без владельца, чтобы релизный PR одобрял любой участник. Google: CONTRIBUTING прямо требует ревью для всех изменений - 16 из 24 (формулировка шаблона new-project), требует тесты - 15, ссылается на стайлгайд - 9; `CODEOWNERS` - 9 из 24 (у go-github вместо него `REVIEWERS`); защита ветки как код - 3 из 24, и во всех трёх одно одобрение плюс одобрение владельцев и обязательные проверки, включая CLA; workflow с ИИ-ревью - 2 (keras, tensorflow). У обеих компаний число ревьюеров и время до слияния не измерялись.

**Куда ведут правила.**

| Тема | Яндекс | Google |
|---|---|---|
| Минимум одобрений | одно, от участника команды - MUST, записано у YDB и `util` ([Y-CR-001](../docs/git/code-review.md)) | одно, от человека, кроме автора, в том числе для сопровождающих - MUST ([G-CR-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); второе вводят только по риску ([G-CR-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)) |
| Владельцы кода | одобрение каждого вызванного владельца - MUST, записано у Gravity UI ([Y-CR-002](../docs/git/code-review.md)); автоназначение по путям ([Y-CR-003](../docs/git/code-review.md)); отдельный владелец у конфигов стиля и CI ([Y-CR-011](../docs/git/code-review.md)) | `CODEOWNERS` как замена `OWNERS` ([G-CR-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md), реконструкция: официальной рекомендации по `CODEOWNERS` у Google нет) |
| Кто сливает | участник команды или владелец; внешний автор сам не сливает ([Y-CR-004](../docs/git/code-review.md)) | тот, кто сливает, проверяет статус CLA ([G-REPO-023](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Тесты в PR | MUST ([Y-CR-005](../docs/git/code-review.md)) | в том же PR ([G-BR-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)) |
| Автоматика раньше людей | ревьюер получает PR с пройденными тестами и линтерами ([Y-CR-006](../docs/git/code-review.md)); ИИ-ревью - первый проход, решение за человеком ([Y-CR-012](../docs/git/code-review.md)) | что умеет инструмент - проверяет инструмент, ревьюер не повторяет ([G-CR-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); спор о стиле решает стайлгайд ([G-CR-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)) |
| Сроки | ответ на итерацию в пределах двух рабочих дней ([Y-CR-007](../docs/git/code-review.md)); заброшенный PR закрывается через три месяца ([Y-CR-008](../docs/git/code-review.md)) | первый ответ не позже чем через один рабочий день ([G-CR-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)) |
| Стандарт одобрения | публичных данных не найдено | одобрять, как только изменение однозначно улучшает код ([G-CR-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); сложность убирают до слияния, а не «потом» - MUST ([G-CR-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)) |
| Тон и споры | публичных данных не найдено; альтернатива - eng-practices (не Яндекс) | замечание о коде, а не об авторе ([G-CR-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); метки «Nit:», «Optional:», «FYI:» ([G-CR-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); автор не отвечает в раздражении - MUST ([G-CR-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); споры по шагам до эскалации ([G-CR-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)) |
| Экстренные случаи | откат ломающего изменения - без ожидания содержательного ревью, по регламенту `util` ([Y-CR-010](../docs/git/code-review.md)) | ускоренное ревью только для экстренного маленького изменения, потом полное ([G-CR-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); откат из-за сломанной сборки экстренным случаем гайд не считает |
| Документация | ревью по чек-листу, при наличии выделенных ревьюеров - в два этапа, как у YDB ([Y-CR-013](../docs/git/code-review.md)) | отдельного правила нет; документацию меняют в том же PR ([G-DOC-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |

Что важно для читателя, который берёт один из профилей: правила Google о ревью почти полностью проверяются только людьми, и их ценность - в общем словаре команды (LGTM с замечаниями, «Nit:», шаги разрешения спора). Правила Яндекса, наоборот, почти все выражаются настройками хостинга - число одобрений, владельцы, автослияние при закрытых обсуждениях ([Y-CR-009](../docs/git/code-review.md) - по образцу `auto_merge.requirements: comment_issues_closed` в `a.yaml`). Интерпретация: это следствие источников, а не культур. От Google наружу вышел текст о поведении ревьюера, от Яндекса - конфигурация ревью; о поведении ревьюеров Яндекса публичных данных нет, о конфигурации ревью внутри Google известно только по книге. Оба профиля честно это маркируют: у Яндекса каждое правило ревью несёт статус «записанное правило проекта», «реконструкция» или «не Яндекс», у Google - пометку «реконструкция» на всём, что касается `CODEOWNERS` и замены readability.

## 6. Версионирование, релизы, changelog

**Вывод.** Здесь обе компании выглядят одинаково пёстро и одинаково опираются на внешние соглашения - SemVer и release-please, - а единственный инструмент, который связывает обе выборки, написан в Google (googleapis) и используется проектами Яндекса. Письменные правила разные по жанру: у Google - политика OSPO о несовместимых изменениях в библиотеках и правила версионирования сетевых API (AIP), у Яндекса - две проектные схемы (календарная версия YDB с четырьмя числами и стабильными ветками; SemVer с исключениями у ydb-go-sdk). Оба профиля берут SemVer, тег `vX.Y.Z` и release-please как умолчание, а продуктовую схему со стабильными ветками описывают как вариант.

| Показатель | Яндекс (из 25) | Google (из 24) |
|---|---|---|
| Тегов нет вовсе | 5 (yatool, YaFSDP, mysync, graphland, tabred) | 2 (google-research, python-docs-samples) |
| ≥ 90 % тегов похожи на SemVer / трёхчастная версия | 15 | 19 |
| Преобладает тег `vX.Y.Z` | 14 | 14 |
| Без `v` | 1 (ydb-python-sdk) | 2 (bazel, pyink) |
| Тег с именем компонента | 3 (ytsaurus, ytsaurus-k8s-operator, ytsaurus-ui) | 3 (google-cloud-go, google-cloud-python, jax) |
| Другие схемы | `N.N.N.N` и `CLI_N.N.N` у YDB, `vN.N` у userver | дата: `20260817.0` (abseil-cpp), `2025-11-05` (re2) - модель «live at head» |
| Предварительные версии | `-rcN`, `-rc.N`, `-alpha.N`, `-beta.N`, `bN` - единой записи нет | `v2.22.0-rc0` (tensorflow), `10.0.0rc1` (bazel) - единой записи нет |
| Хотя бы 12 тегов за 12 месяцев | 14 | не измерялось |
| Большинство тегов лёгкие (не аннотированные) | аннотированные преобладают только у 3 (yandex-ai-studio-sdk, ch-tools, catboost); в 9 их нет совсем | 19 |
| release-please | 5 (3 напрямую; uikit и page-constructor - через `gravity-ui/release-action`) | 4 |
| Файл changelog | 9 (`CHANGELOG.md` в корне) | 13 (автоматический - 4; вручную - `CHANGELOG.md`, `CHANGES.md`, `RELEASE.md`, `NEWS`) |
| Changelog пишут люди в PR | 6: `CHANGELOG.md` с проверкой в CI (ydb-go-sdk), changie (terraform-provider-yandex, pandora), раздел «Changelog entry» в шаблоне PR (ydb, ytsaurus) | guava и bazel собирают заметки из трейлера `RELNOTES` в коммитах |
| Конфиг release-please расходится со схемой | у Diplodoc ключи `changelog-types` и `tagPrefix`, которых нет в схеме 17.11.2 | README action показывает `@v4`, актуальный тег - v5.0.0 |

**Что записано.** Google: [политика о несовместимых изменениях](https://opensource.google/documentation/policies/library-breaking-change) (2023-01-18) - несовместимое изменение даёт новую мажорную версию, прошлая поддерживается не меньше 12 месяцев, больше одной мажорной в год не выпускают; действует только для присоединившихся проектов ([G-REL-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md), [G-REL-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md), [G-REL-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)). AIP-180/181/185 - версии и уровни стабильности сетевых API: мажорная версия в пути, `v1alpha`, `v1beta`, `v1` ([G-REL-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)). Abseil описывает модель «live at head» и предупреждает, что LTS-снимки - не версии. Яндекс: YDB - четыре числа `XX.Y.Z.A` (год, мажор, минор, патч), около четырёх мажорных релизов в год, ветки `stable-XX-Y` и `stable-XX-Y-Z`, hotfix-ветки от тега, в нечётных мажорных версиях новая функциональность выключена флагами ([manage-releases.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/manage-releases.md); [Y-REL-010](../docs/git/releases.md)); ydb-go-sdk - SemVer 2.0.0 с исключениями для API, помеченного `// Experimental`, `// Deprecated` (живёт не меньше шести месяцев) и `// Internals` ([VERSIONING.md](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29d/VERSIONING.md); [Y-REL-013](../docs/git/releases.md)); userver - релизы как снимки `develop` раз в месяц-два, исправления в старые релизы не переносятся.

Сравните две политики поддержки: Google обещает 12 месяцев для прошлой мажорной версии библиотеки, ydb-go-sdk - шесть месяцев для устаревшего API. Других сроков поддержки в источниках этого сравнения нет; обе цифры - политики конкретных проектов или программ, а не компаний.

**Куда ведут правила.** Совпадают: SemVer ([Y-REL-001](../docs/git/releases.md), [G-REL-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), тег `vX.Y.Z` с префиксом компонента при нескольких пакетах ([Y-REL-002](../docs/git/releases.md), [Y-REL-003](../docs/git/releases.md), [G-REL-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), предварительная версия через точку `-rc.N` ([Y-REL-002](../docs/git/releases.md), [G-REL-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), release-please там, где принят Conventional Commits, без ручной правки версии и changelog ([Y-REL-004](../docs/git/releases.md), [Y-REL-007](../docs/git/releases.md), [G-REL-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), минорная версия вместо мажорной до 1.0.0 ([Y-REL-006](../docs/git/releases.md), [G-REL-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)). Только у Яндекса: правило о ручном changelog с проверкой записи в CI ([Y-REL-008](../docs/git/releases.md) - job `changelog-checker` у ydb-go-sdk), о языке и адресате записи ([Y-REL-009](../docs/git/releases.md)), о календарной схеме ([Y-REL-010](../docs/git/releases.md)) и о ветке `release/vN` для прошлой мажорной версии ([Y-REL-012](../docs/git/releases.md)). Только у Google: тег не перемещают - MUST по SemVer ([G-REL-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), срок поддержки ([G-REL-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), минимальные права workflow релиза ([G-REL-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), публикация отдельным шагом по событию релиза ([G-REL-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)), версии сетевого API ([G-REL-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)).

Так выглядит changelog, который пишет release-please у Яндекса (фрагмент [uikit/CHANGELOG.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/CHANGELOG.md); у googleapis формат тот же, потому что инструмент тот же):

```markdown
## [7.51.0](…/compare/v7.50.1...v7.51.0) (2026-10-06)

### Features

* **Dialog:** add disableTransition prop ([#2855](…)) ([c1ae095](…))
```

Интерпретация: гипотеза брифа о том, что release-please автоматизирует релизы на основе Conventional Commits, подтверждена с обеих сторон наблюдением, а не только документацией: у Яндекса формат соблюдается в ≥ 97 % коммитов ровно в репозиториях с release-please (плюс datalens-backend), у Google - в 98-100 % во всех четырёх. Инструмент тянет за собой формат, а не наоборот.

## 7. CI и pre-commit

**Вывод.** Ни одна из компаний не публикует образцового CI или `.pre-commit-config.yaml`: в `google/new-project` нет ни одного CI-файла, у Яндекса нет шаблона репозитория вовсе. Разница в письменном слое одна, но заметная: у Google есть требования OSPO к безопасности workflow - закреплять сторонние действия на SHA коммита, объявлять `permissions:`, защищать основные ветки там, где Actions получают доступ, - и они превращаются в правила MUST ([G-REPO-024](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)); у Яндекса требований к CI нет, и правило о составе проверок - реконструкция ([Y-REPO-016](../docs/git/repository.md)). Локальные хуки у обеих компаний - дело проекта: фреймворк pre-commit есть у 1 из 25 репозиториев Яндекса и у 6 из 24 Google.

| Показатель | Яндекс (из 25) | Google (из 24) |
|---|---|---|
| Workflow GitHub Actions | 22 | не измерялось отдельно |
| Сборка или тесты на PR / явный шаг линтера | 19 / 14 | не измерялось в этих терминах; CONTRIBUTING требует тесты - 15 |
| Сторонние действия закреплены на SHA (≥ 90 %) | не измерялось | 12; flatbuffers, microservices-demo и re2 не закрепляют ни одного |
| `permissions:` объявлены во всех workflow | не измерялось | 14 |
| Dependabot или Renovate | 8 | 15 |
| Фреймворк pre-commit | 1 (yandex-ai-studio-sdk) | 6 (optax, flax, yapf, google-cloud-python, jax, keras); у 5 из них CI запускает `pre-commit run --all-files` |
| husky | 5 (JS/TS-проекты Gravity UI и Diplodoc) | - |
| CodeQL | 4 | не измерялось |
| Автоматическая проверка заголовков лицензии | - (заголовков нет) | 7 (бот - 4, свои скрипты - 3) |
| Автоматическая проверка CLA | 0 из 22 с Actions | статус `cla/google` в обязательных проверках (3 из 3 репозиториев с настройками как код) |
| CI для PR из форков на собственных раннерах | после метки `ok-to-test` (YDB, YTsaurus, Perforator) | публичных данных не найдено |
| Сборка документации на каждом PR | YDB: `docs-build-action@v3` с превью в комментарии ([Y-DOC-010](../docs/git/repository.md)) | - |
| `.gitlab-ci.yml` | 0 | 0 |

У Яндекса линтеры обычно оформлены как команды `make`, `npm run` или `tox`, и CI с локальными хуками вызывают одни и те же команды; у yandex-ai-studio-sdk CONTRIBUTING предупреждает: если автор не настроил pre-commit локально, исправления в PR закоммитит робот. У Google измерение выделило не состав проверок, а их безопасность: половина выборки соблюдает требование о закреплении действий на SHA, половина - нет. Правила профиля Google об обязательных проверках ([G-REPO-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) собраны из `sync-repo-settings.yaml` googleapis - список `requiredStatusCheckContexts: [cla/google, docs, lint, test (18), windows]` - и помечены как реконструкция.

Оба профиля дают `.pre-commit-config.yaml` ([Яндекс](../configs/.pre-commit-config.yaml), [Google](https://github.com/k1sur1n/google-codestyle/blob/main/configs/.pre-commit-config.yaml)) с пометкой «не Яндекс» / «не Google» на самом фреймворке и общими хуками (pre-commit-hooks, ruff, mypy, clang-format, nbstripout, gitleaks); отличия - там, где отличаются правила: у Google в хуках есть `addlicense`, `pyink`, `pylint` и `commitlint`, у Яндекса - ESLint, Stylelint, Prettier и собственный shell-хук `commit-msg`. CI-шаблоны - `templates/github/workflows/lint.yml` и `templates/gitlab/.gitlab-ci.yml` в каждом профиле.

Интерпретация: разница в требованиях к безопасности CI объясняется масштабом организаций на GitHub, а не отношением к безопасности: у OSPO есть отдельный документ о GitHub-сервисах для сотен репозиториев, у Яндекса такого уровня управления снаружи не видно. Для своего репозитория правила Google о SHA и `permissions:` стоит взять независимо от выбранного профиля - они не зависят от языка и стиля.

## 8. Документация

**Вывод.** Это единственная тема, где у Яндекса письменных правил не меньше, чем у Google, - просто они принадлежат одному проекту. Google публикует два общих документа: [docguide](https://google.github.io/styleguide/docguide/) (разметка Markdown и содержание README; `style.md` обновлён 2026-09-14) и [Google developer documentation style guide](https://developers.google.com/style) (язык документации, CC BY 4.0). У Яндекса общекорпоративного гайда нет, но YDB опубликовал полный набор - гайд по стилю, структуру, жанры и порядок ревью документации - поверх платформы Diplodoc с диалектом YFM и линтером; YTsaurus описывает похожие правила короче. Главное содержательное различие: документация Яндекса по устройству двуязычная (зеркальные каталоги `en/` и `ru/`), документация Google - англоязычная, и её гайд по языку к русскому тексту неприменим.

| Параметр | Яндекс (YDB, YTsaurus на Diplodoc) | Google (docguide, developer documentation style guide) |
|---|---|---|
| Где лежат правила | проект: [style-guide](https://ydb.tech/docs/en/contributor/documentation/style-guide) (2026-08-01), `structure.md`, `genres.md`, `review.md` YDB; `yt/docs/README.md` YTsaurus | компания: google/styleguide (`docguide/`), developers.google.com/style |
| Статус | «набор рекомендаций, а не жёстких правил» | рекомендации; единственное «must» - имя файла `README.md` |
| Платформа и диалект | Diplodoc, YFM (совместим с CommonMark; заметки, каты, табы, термины, переменные, включения) | Markdown по CommonMark; `[TOC]` рассчитан на Gitiles |
| Структура проекта | `.yfm`, `.yfmlint`, `presets.yaml`, `redirects.yaml`, `toc.yaml`, `_includes/`, зеркальные `en/` и `ru/` ([Y-DOC-003](../docs/git/repository.md), [Y-DOC-005](../docs/git/repository.md), [Y-DOC-007](../docs/git/repository.md)) | `README.md` в корне каталога с кодом, `docs/` объясняет четыре вещи: начать, тесты, отладка, релиз ([G-DOC-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-DOC-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-DOC-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Имена файлов | через дефис, MUST ([Y-DOC-002](../docs/git/repository.md)) | правила нет |
| Ссылки | относительные, с `.md`, без домена - MUST, проверяет `YFM003` ([Y-DOC-004](../docs/git/repository.md)) | текст ссылки называет цель; не подниматься через `../` ([G-DOC-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Длина строки | не задана | 80 символов ([G-DOC-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| HTML в Markdown | не используется; `MD033: error` у YDB, `allowHtml: false` в Diplodoc ([Y-DOC-011](../docs/git/repository.md)) | предпочитать Markdown; markdownlint `MD033` (не Google) ([G-DOC-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Жанры | одна цель и один жанр на статью: теория, руководство, справочник, FAQ, рецепт, release notes, подборка ссылок ([Y-DOC-006](../docs/git/repository.md)) | «минимально достаточная документация», устаревшее удаляют ([G-DOC-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Язык текста | активный залог, простой язык, термин со ссылкой на глоссарий; для русского - «ё», «ёлочки», длинное тире, без title case ([Y-DOC-008](../docs/git/repository.md)) | второе лицо, действительный залог, sentence case, условие перед инструкцией ([G-DOC-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)); только для английского |
| README | пять вопросов: что это, как установить, как собрать, как внести вклад, лицензия - реконструкция по 25 README ([Y-DOC-009](../docs/git/repository.md)) | пять вопросов: что и зачем, к кому обращаться, статус, как пользоваться, где документация ([G-DOC-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Проверка в CI | `yfm build` и `.yfmlint` на каждом PR, у YDB около 35 правил на уровне `error` и превью в комментарии ([Y-DOC-010](../docs/git/repository.md)) | линтера Markdown Google не публикует; профиль предлагает markdownlint (не Google) |
| Ревью документации | два ревьюера, итерация - два рабочих дня, чек-лист из 11 пунктов ([Y-CR-013](../docs/git/code-review.md)) | документацию меняют в том же PR, что и код ([G-DOC-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Внешние справочники | Chicago Manual of Style, Merriam-Webster | Merriam-Webster, Chicago Manual of Style, Microsoft Writing Style Guide; выше них - правила проекта |
| Доля в выборке | проект Diplodoc (`.yfm`) - 5 из 25; `.yfmlint` - 2 | README есть во всех 24; в google-research README лежит в 735 из 755 каталогов проектов |

Два списка «пяти вопросов README» стоит прочитать рядом: у Яндекса README - инструкция (установить, собрать, внести вклад), у Google - паспорт (кто отвечает, какой статус, где документация). Интерпретация: README-инструкция характерна для продуктов, которые пользователи ставят сами (YDB, YTsaurus), README-паспорт - для монорепозитория из сотен каталогов, где нужно быстро понять, живой ли код и кого спрашивать; docguide прямо пишет, что README лежит в каждом каталоге с самостоятельным пакетом. Линтер YFM переиспользует правила markdownlint (`MD*`) и добавляет свои (`YFM*`), поэтому технически профили ближе, чем выглядят: `MD033` запрещает HTML у обоих.

## 9. GitHub и GitLab

**Вывод.** Ни одна из компаний не публикует материалов для GitLab: `.gitlab-ci.yml` или каталога `.gitlab/` нет ни в одном из 25 репозиториев Яндекса и ни в одном из 25 (с шаблоном) у Google; страница OSPO о хостинге рекомендует GitHub, упоминает Gerrit и не упоминает GitLab. Поэтому GitLab-варианты в обоих профилях - перенос с пометкой «перенос на GitLab - не Яндекс» / «не Google», и платформенные различия у обоих профилей одни и те же. Google при этом публикует правила для GitHub как платформы (OSPO о репозиториях и GitHub Actions), у Яндекса и этого нет.

**Что переносят профили.** Оба - `templates/gitlab/`: `CODEOWNERS`, `issue_templates/Bug.md` и `Feature.md`, `merge_request_templates/Default.md`, `.gitlab-ci.yml`; в документах - правый столбец таблиц «GitHub | GitLab» в [repository.md](../docs/git/repository.md#github-и-gitlab-различия-платформ) Яндекса и [repository.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md#github-и-gitlab-различия) Google, а также в `branches.md`, `commits.md` и `code-review.md` обоих профилей. Шаблон `CODEOWNERS` для GitLab у обоих разбит на секции, потому что у GitHub файл плоский; шаблоны issue для GitLab у Яндекса переписаны из YAML-форм в Markdown с потерей обязательных полей, у Google - перенесены с тем же текстом разделов (меняются только имя файла, front matter и строка `/label`), потому что профиль Google и на GitHub держит Markdown ([G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)).

**Различия, которые влияют на правила.** Сведены по таблицам обоих профилей; свойства платформ сверены профилями с документацией 2026-10-09.

| Тема | GitHub | GitLab | На какие правила влияет |
|---|---|---|---|
| Обязательное одобрение и одобрение владельцев кода | в защите ветки; в публичных репозиториях - на бесплатном тарифе | approval rules и «Require approval from code owners» - только Premium и Ultimate; на Free одобрение не блокирует слияние | [Y-CR-001](../docs/git/code-review.md), [Y-CR-002](../docs/git/code-review.md), [G-CR-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md), [G-CR-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md) - на бесплатном GitLab остаются договорённостью |
| `CODEOWNERS` | `.github/`, корень или `docs/`; плоский список, побеждает последнее совпавшее правило | корень, `docs/` или `.gitlab/`; секции `[Имя]`, необязательные `^[Имя]`, число одобрений `[Имя][2]`, исключения `!` | «одобрение всех вызванных владельцев» ([Y-CR-002](../docs/git/code-review.md)) выражается секциями |
| Шаблоны issue | YAML-формы с обязательными полями; `config.yml` отключает пустые issue и даёт `contact_links` | только Markdown в `.gitlab/issue_templates/`; форм и `config.yml` нет, метки - `/label` | [Y-REPO-015](../docs/git/repository.md) теряет обязательность полей; [G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) переносится как есть |
| Шаблон PR / MR | `.github/PULL_REQUEST_TEMPLATE.md` | `.gitlab/merge_request_templates/Default.md` подставляется сам; переменные и quick actions | [Y-REPO-014](../docs/git/repository.md), [G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Сообщение squash-коммита | заголовок PR плюс список коммитов (или сообщение единственного коммита); переключается на «Pull request title and description» | шаблон `%{title}`; `%{description}` и `%{reference}` добавляют вручную | [Y-GIT-002](../docs/git/commits.md), [G-GIT-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md): проверять нужно заголовок PR/MR |
| Серверная проверка сообщений и заголовка MR | нет - только CI | push rules с регулярным выражением; «Title pattern» для MR (GitLab 18.10); Premium и Ultimate | [Y-GIT-013](../docs/git/commits.md), commitlint-конфиги Google |
| Актуальность ветки перед слиянием | «Require branches to be up to date» или merge queue | fast-forward merge требует rebase; merge trains - Premium и Ultimate | [Y-BR-007](../docs/git/branches.md), [G-BR-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md) |
| Имена веток | в стандартной защите нет; ruleset «Restrict branch names» или CI | push rule «Branch name» - Premium и Ultimate | [Y-BR-004](../docs/git/branches.md) |
| CI для PR из форка на своих раннерах | метка `ok-to-test` в workflow | пайплайн MR из форка в родительском проекте запускает участник кнопкой; метка не нужна | [Y-BR-008](../docs/git/branches.md) |
| Файлы организации | репозиторий `<org>/.github`: CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, шаблоны (но не LICENSE) | аналога для файлов нет - кладут в каждый репозиторий; шаблоны описаний уровня группы - Premium | [G-REPO-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md): «файл организации» на GitLab не работает |
| Проверка CLA | приложение Google CLA, статус `cla/google` - только для проектов Google; у Яндекса бота нет | публичных данных не найдено; свой job в CI | [G-REPO-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [Y-REPO-007](../docs/git/repository.md) |
| release-please | `googleapis/release-please-action` | не поддерживается | [Y-REL-004](../docs/git/releases.md), [G-REL-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md) - на GitLab нужна замена |
| Политика безопасности | вкладка Security policy, Security Advisories | `SECURITY.md` - обычный файл; закрытый канал - e-mail или confidential issue | [Y-REPO-009](../docs/git/repository.md), [G-REPO-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |

Интерпретация: самое важное из этой таблицы - тариф. Все правила о ревью, которые в обоих профилях выражены настройками хостинга (число одобрений, владельцы кода, имена веток, серверная проверка сообщений), на бесплатном GitLab не включаются и остаются договорённостью команды; на GitHub число одобрений и владельцы кода доступны публичным репозиториям бесплатно, а серверной проверки сообщений нет вовсе - её делает CI. Второе - release-please: если changelog должен собираться из коммитов на GitLab, инструмент придётся заменить, и выбор Conventional Commits как умолчания (профиль Яндекса) теряет половину своего обоснования.

## Итог: что взять в обычный репозиторий

Колонка «что взять» - вывод авторов сравнения, а не позиция компаний; подробное обоснование по областям - в [choosing.md](choosing.md).

| Практика | Яндекс | Google | Что взять в обычный репозиторий |
|---|---|---|---|
| Обязательные файлы | README, LICENSE, `.gitignore`, CONTRIBUTING - реконструкция по долям; файлы сообщества у 7 из 25 | то же записано у OSPO; SECURITY и CODE_OF_CONDUCT приходят из `google/.github` | минимум обоих профилей плюс `SECURITY.md` и `CODE_OF_CONDUCT.md` для проекта с внешними пользователями ([choosing.md](choosing.md)) |
| Лицензия | Apache-2.0 для продуктов, MIT для npm-пакетов | Apache-2.0 по умолчанию | любой из профилей: оба дают Apache-2.0 для библиотеки и сервиса |
| Заголовок лицензии в файлах | нет (0 из 25) | есть, MUST (19 из 24), `addlicense` | по типу проекта: при активном внешнем вкладе - заголовки по Google, иначе один `LICENSE` по Яндексу |
| CLA / DCO | без CLA, вклад под лицензией проекта; DCO нет | CLA с ботом; DCO нет | вариант Яндекса для своего проекта (CLA - юридический документ компании); DCO - ни у кого |
| Сторонний код | `contrib/`, `vendor/`; лицензия обязательна | `third_party/` с `LICENSE` у каждой библиотеки; список запрещённых лицензий | каталог любого имени, но с правилами Google о лицензиях ([G-REPO-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)) |
| Формат коммита | Conventional Commits, строчная буква, 72 символа, `[PROJ-123]` в конце | предложение-приказ с заглавной буквы, 72 символа, `Fixes #N` в футере; Conventional Commits с release-please | зависит от того, собирается ли changelog из истории: да - Яндекс, нет - Google ([choosing.md](choosing.md)) |
| Проверка сообщений | хук `commit-msg` плюс job в CI (5 из 25 так делают) | commitlint (не Google; 0 из 24) | хук и job по образцу Яндекса - это единственная проверяемая практика в обеих выборках |
| Ветки и слияние | `main`, trunk-based, squash, линейная история, `members/<user>/…` | `main`, trunk-based, squash, линейная история; имена веток не заданы | профили совпадают; имя ветки - по Яндексу, если команда хочет схему |
| Размер изменения | публичных данных нет; взято у Google | около 100 строк, отдельный рефакторинг | Google ([G-BR-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md), [G-BR-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md)) |
| Код-ревью: настройки | одно одобрение, владельцы, автослияние при закрытых обсуждениях | одно одобрение, владельцы, обязательные проверки с CLA | любой профиль; обе модели совпадают в настройках |
| Код-ревью: поведение | публичных данных нет | полный гайд eng-practices | Google ([G-CR-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)…[G-CR-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/code-review.md)); регламент сроков и заброшенных PR - у Яндекса ([Y-CR-007](../docs/git/code-review.md), [Y-CR-008](../docs/git/code-review.md)) |
| Версии и релизы | SemVer, `vX.Y.Z`, release-please; календарная схема для продукта | SemVer, `vX.Y.Z`, release-please; политика 12 месяцев поддержки | профили совпадают; срок поддержки запишите по образцу Google ([G-REL-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)) |
| Changelog | из коммитов или людьми в PR с проверкой в CI | из коммитов; формат ручного не задан | release-please на GitHub; на GitLab - ручной changelog с проверкой по образцу ydb-go-sdk ([Y-REL-008](../docs/git/releases.md)) |
| CI | тесты и линтеры на PR, обязательные проверки - реконструкция | то же плюс SHA-закрепление действий и `permissions:` - MUST | Google ([G-REPO-024](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REL-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md)); метка `ok-to-test` для своих раннеров - Яндекс ([Y-BR-008](../docs/git/branches.md)) |
| Документация | Diplodoc/YFM, двуязычные каталоги, гайд YDB, линтер в CI | docguide, developer documentation style guide, 80 колонок | для русскоязычной документации - Яндекс; для англоязычной - Google; структурные правила Markdown у обоих совместимы |
| GitLab | перенос, «не Яндекс» | перенос, «не Google» | одинаковые ограничения; главное - тариф и отсутствие release-please |

Что не стоит переносить ни из одного профиля: механику зеркал монорепозитория (`.mapping.json`, `commit_hash:`, `PiperOrigin-RevId`, роботы экспорта), трейлеры Gerrit (`Change-Id:`), CLA компании в чужом проекте и фразу «not an officially supported Google product». Эти вещи существуют потому, что источник истины лежит внутри компании, и в репозитории, который живёт на GitHub или GitLab, они ничего не решают. Подробнее о том, чему поучиться у каждой команды, - в [choosing.md](choosing.md); термины Arcanum, Arc, Аркадия, Copybara, Critique, Piper, readability - в [glossary.md](glossary.md).
