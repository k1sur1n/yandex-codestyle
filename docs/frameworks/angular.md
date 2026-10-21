# Angular в профиле «Яндекс»

> Данные актуальны на 2026-10-09.

Публичных практик Яндекса для Angular нет: публичных данных не найдено - ни гайда, ни конфигов, ни открытых Angular-проектов или библиотек. Поэтому Angular-специфику профиль берёт из общепринятой альтернативы с пометкой «не Яндекс»: это официальный Angular Style Guide (гайд команды Angular в Google, редакция 2025 года) и линтер `angular-eslint`. Язык, форматирование и коммиты в Angular-проекте остаются по профилю Яндекса. Ниже 15 правил области NG; все они - «не Яндекс».

Подробный разбор гайда Angular, его истории и инструментов находится в профиле Google: [google-codestyle/docs/frameworks/angular.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md). Здесь - только то, что нужно, чтобы вести Angular-проект рядом с остальным кодом по профилю Яндекса.

## 1. Что искали и что нашли

| Где искали | Результат | Источник |
|---|---|---|
| Зависимости 16 публичных JS/TS-репозиториев Яндекса (Gravity UI, YDB, DataLens, Diplodoc, Yandex Cloud SDK) | ни одной зависимости `@angular/*`; React указан в 14 `package.json` | примеры: [uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/package.json), [ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/package.json) |
| Конфиги линтеров Яндекса | Angular-конфигов нет: `@gravity-ui/eslint-config` экспортирует только `base`, `typescript`, `react`, `client`, `server`, `prettier`, `import-order`, `a11y`; в архивном mapsapi-codestyle есть только JS, TS и React | [package.json](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/package.json), [README mapsapi-codestyle](https://github.com/yandex/mapsapi-codestyle/blob/d549f85deb7ed7d90e3b302478fc50dd950447e0/README.md) (архив) |
| Страница вакансий фронтенд-разработчиков Яндекса | названы TypeScript, React, Node.js; Angular не упомянут | [yandex.ru/jobs](https://yandex.ru/jobs/professions/frontend-developer) |
| Документация JS API Яндекс Карт | есть официальная интеграция с Vue и примеры для Next.js; Angular не упомянут, Angular-обёртки для Карт - сторонние пакеты | [Integration with Vue](https://yandex.com/maps-api/docs/js-api/dg/concepts/integrations/vuefy.html), [angular8-yandex-maps](https://npmjs.com/package/angular8-yandex-maps) |

Поиск шёл на русском и английском; релевантных первичных источников нет. Используют ли Angular отдельные внутренние команды Яндекса - публичных данных не найдено. Отсутствие публичных следов не доказывает, что Angular в компании не применяется.

## 2. Из чего складывается Angular-проект по профилю Яндекса

| Слой | Что брать | Чей это источник |
|---|---|---|
| Angular-специфика: имена файлов, структура, внедрение зависимостей, компоненты, шаблоны | правила Y-NG-001 - Y-NG-015 ниже | Angular Style Guide и `angular-eslint` - **не Яндекс** |
| Язык TypeScript | Y-TS-002 - Y-TS-009 из [docs/languages/other.md](../languages/other.md) | Gravity UI (Яндекс) |
| Форматирование | Y-TS-001 и [`.prettierrc.json`](../../configs/web/.prettierrc.json) профиля | Gravity UI (Яндекс) |
| Имена CSS-классов и проверки стилей | Y-CSS-001, Y-CSS-002 (схема имён БЭМ) и проверки Stylelint Y-CSS-006 - Y-CSS-008, Y-CSS-010 - Y-CSS-012, Y-CSS-014 из [react.md](react.md#4-css-и-бэм) | БЭМ и Gravity UI (Яндекс) |
| Коммиты, ветки, ревью | [docs/git/](../git/commits.md) | реконструкция по репозиториям Яндекса |

Правила Y-CSS-003 - Y-CSS-005, Y-CSS-009 и Y-CSS-013 (хелпер `block()`, префикс блока, один SCSS-файл на компонент, токены и CSS-переменные Gravity UI) описывают практику React-компонентов; как применять БЭМ в шаблонах Angular, публичные источники Яндекса не говорят - публичных данных не найдено.

Интерпретация: профиль оставляет форматирование Gravity UI и для Angular-кода, чтобы весь TypeScript в репозитории выглядел одинаково. Публичной практики Яндекса за этим решением нет. Оно расходится с умолчаниями Angular CLI в двух пунктах - в отступе и в пробелах внутри фигурных скобок:

| Параметр | Шаблон нового проекта Angular CLI | Профиль Яндекса | Что берёт профиль |
|---|---|---|---|
| Отступ | 2 пробела (`.editorconfig`) | 4 пробела | 4 пробела |
| Пробелы в `{}` | умолчание Prettier: `{ a }` | `bracketSpacing: false`: `{a}` | `{a}` |
| Длина строки | `printWidth: 100` | `printWidth: 100` | совпадают |
| Кавычки | `singleQuote: true` | `singleQuote: true` | совпадают |
| Шаблоны `*.html` | `parser: "angular"` в `overrides` | не задано | добавить блок из шаблона CLI (не Яндекс) |

Источники значений: [шаблон `.prettierrc` Angular CLI](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/workspace/files/.prettierrc.template) и [файлы нового проекта](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/workspace/files) (CLI 22.x, MIT); [`@gravity-ui/prettier-config` 1.1.1](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/index.js). В репозитории самого фреймворка Angular скобки тоже пишутся без пробелов (`bracketSpacing: false`), а отступ - 2 пробела ([.prettierrc angular/angular](https://github.com/angular/angular/blob/main/.prettierrc)). Блок, который в Angular-проекте дописывается в `overrides` файла `.prettierrc.json` (не Яндекс):

```json
{"files": "*.html", "options": {"parser": "angular"}}
```

Ещё одно расхождение касается имён файлов. В React-части профиля служебные файлы `utils.ts`, `constants.ts`, `types.ts` допустимы (Y-REACT-015), а гайд Angular советует таких общих имён избегать (Y-NG-005). Это правила разных экосистем: в Angular-коде действует Y-NG-005.

## 3. Правила Angular (не Яндекс)

Все правила взяты из [Angular Style Guide](https://angular.dev/style-guide) в редакции 2025 года: документ переписан коммитом от 2025-04-22 и действует для Angular v22.2.2 (2026-10-08). Гайд сам называет свои рекомендации необязательными для работы Angular, поэтому почти все правила - SHOULD; MUST стоит только там, где формулировка источника категорична. Проверки - из `angular-eslint` 22.5.0 (проект сообщества, MIT; только flat config, ESLint 9 или 10).

Советы из старой редакции гайда (нумерация Style 01-01 и далее, до апреля 2025) устарели: суффиксы `.component.ts` и `Component`, модули `SharedModule`, обработчики с префиксом `on`, `@HostBinding` вместо `host`. Что именно изменилось - в [профиле Google](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md).

### Y-NG-001 · SHOULD · Слова в имени файла разделяются дефисом; файлы компонента имеют одно базовое имя: `user-profile.ts`, `user-profile.html`, `user-profile.css`
- Проверка: ручное ревью; такие имена создают генераторы Angular CLI.
- Источник: [Separate words in file names with hyphens](https://angular.dev/style-guide#separate-words-in-file-names-with-hyphens) и [Use the same file name for a component's TypeScript, template, and styles](https://angular.dev/style-guide#use-the-same-file-name-for-a-components-typescript-template-and-styles) (редакция 2025, Angular v22.2.2) · официальный гайд · высокая · не Яндекс.

### Y-NG-002 · SHOULD · Имена файлов и классов пишутся без суффикса типа: `user-profile.ts` и `UserProfile`, а не `user-profile.component.ts` и `UserProfileComponent`
- Проверка: Angular CLI, опция `fileNameStyleGuide: "2025"` (умолчание); правила `@angular-eslint/component-class-suffix` и `@angular-eslint/directive-class-suffix` остаются выключенными.
- Источник: [Match file names to the TypeScript identifier within](https://angular.dev/style-guide#match-file-names-to-the-typescript-identifier-within) (редакция 2025) · официальный гайд · средняя · не Яндекс; [ng-new/schema.json Angular CLI](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/ng-new/schema.json) (CLI 22.x) · конфиг или инструмент · высокая · не Яндекс. Прямого запрета суффиксов в гайде нет: отказ от них выражен примерами, умолчаниями CLI начиная с v20 и пометкой в [документации angular-eslint](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/component-class-suffix.md). Существующим проектам CLI при обновлении сохраняет прежнюю схему имён.
- Пример:

```text
плохо:  user-profile.component.ts  →  export class UserProfileComponent {}
хорошо: user-profile.ts            →  export class UserProfile {}
```

### Y-NG-003 · SHOULD · Юнит-тесты лежат рядом с проверяемым кодом в файле с тем же именем и окончанием `.spec.ts`; общего каталога `tests` нет
- Проверка: ручное ревью; Angular CLI создаёт `*.spec.ts` рядом с файлом.
- Источник: [Use the same name for a file's tests with `.spec` at the end](https://angular.dev/style-guide#use-the-same-name-for-a-files-tests-with-spec-at-the-end) и [Group closely related files together in the same directory](https://angular.dev/style-guide#group-closely-related-files-together-in-the-same-directory) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-004 · SHOULD · Каталоги проекта отражают функциональные области, а не типы кода: каталогов `components/`, `directives/`, `services/` не заводят
- Проверка: ручное ревью.
- Источник: [Organize your project by feature areas](https://angular.dev/style-guide#organize-your-project-by-feature-areas) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-005 · SHOULD · Имя файла отражает главный идентификатор в нём; общих имён `helpers.ts`, `utils.ts`, `common.ts` избегают
- Проверка: ручное ревью.
- Источник: [Match file names to the TypeScript identifier within](https://angular.dev/style-guide#match-file-names-to-the-typescript-identifier-within) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-006 · SHOULD · Зависимости внедряются функцией `inject()`, а не параметрами конструктора
- Проверка: `@angular-eslint/prefer-inject` (ошибка в наборе `tsRecommended`); для существующего кода есть автоматическая миграция `inject-function`.
- Источник: [Prefer the `inject` function over constructor parameter injection](https://angular.dev/style-guide#prefer-the-inject-function-over-constructor-parameter-injection) (редакция 2025) · официальный гайд · высокая · не Яндекс.
- Пример:

```ts
// плохо
export class UserProfile {
    constructor(private readonly userData: UserData) {}
}

// хорошо
export class UserProfile {
    private readonly userData = inject(UserData);
}
```

### Y-NG-007 · SHOULD · Селектор компонента - элемент в kebab-case с префиксом проекта; селектор директивы - атрибут в camelCase с тем же префиксом
- Проверка: `@angular-eslint/component-selector` с опциями `{type: 'element', prefix: '<префикс>', style: 'kebab-case'}` и `@angular-eslint/directive-selector` с опциями `{type: 'attribute', prefix: '<префикс>', style: 'camelCase'}`.
- Источник: [Choosing component selectors](https://angular.dev/style-guide#choosing-component-selectors) и [Choosing directive selectors](https://angular.dev/style-guide#choosing-directive-selectors) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-008 · MUST · Префикс `ng` в селекторах собственных компонентов и директив не используется
- Проверка: те же правила `@angular-eslint/component-selector` и `@angular-eslint/directive-selector` с заданным префиксом проекта.
- Источник: [Selector prefixes](https://angular.dev/guide/components/selectors#selector-prefixes) (документация Angular v22.2.2) · официальный гайд · высокая · не Яндекс. Формулировка источника категорична («Never»), отсюда MUST.

### Y-NG-009 · SHOULD · Имена output пишутся в camelCase, без префикса `on` и без совпадений с событиями DOM; input и output не переименовываются
- Проверка: `@angular-eslint/no-output-on-prefix`, `@angular-eslint/no-output-native`, `@angular-eslint/no-output-rename`, `@angular-eslint/no-input-rename` (все - ошибки в наборе `tsRecommended`).
- Источник: [Choosing event names](https://angular.dev/guide/components/outputs#choosing-event-names) и [Choosing input names](https://angular.dev/guide/components/inputs#choosing-input-names) (документация Angular v22.2.2) · официальный гайд · высокая · не Яндекс. Требование camelCase для output в источнике категорично («Always»), остальное - рекомендации; правило оставлено на уровне SHOULD как составное.

### Y-NG-010 · SHOULD · Члены класса, которые читает только шаблон компонента, объявляются `protected`
- Проверка: ручное ревью (в `angular-eslint` 22.5.0 такого правила нет).
- Источник: [Use `protected` on class members that are only used by a component's template](https://angular.dev/style-guide#use-protected-on-class-members-that-are-only-used-by-a-components-template) (редакция 2025) · официальный гайд · высокая · не Яндекс. Google TypeScript Style Guide формулирует то же жёстче: такие свойства не должны быть `private` ([tsguide](https://google.github.io/styleguide/tsguide.html#properties-used-outside-of-class-lexical-scope)).

### Y-NG-011 · SHOULD · Свойства, которые инициализирует Angular (`input()`, `model()`, `output()`, запросы), помечаются `readonly`
- Проверка: частично: `@angular-eslint/prefer-output-readonly`, `@angular-eslint/prefer-signals`; остальное - ручное ревью.
- Источник: [Use `readonly` for properties that shouldn't change](https://angular.dev/style-guide#use-readonly-for-properties-that-shouldnt-change) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-012 · SHOULD · Классы и стили привязываются через `[class]` и `[style]`, а не директивами `NgClass` и `NgStyle`
- Проверка: `@angular-eslint/template/prefer-class-binding`, `@angular-eslint/template/prefer-style-binding`.
- Источник: [Prefer `class` and `style` over `ngClass` and `ngStyle`](https://angular.dev/style-guide#prefer-class-and-style-over-ngclass-and-ngstyle) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-013 · SHOULD · Обработчик события называется по действию (`saveUserData()`), а не по событию (`handleClick()`)
- Проверка: ручное ревью.
- Источник: [Name event handlers for what they do, not for the triggering event](https://angular.dev/style-guide#name-event-handlers-for-what-they-do-not-for-the-triggering-event) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-014 · SHOULD · Методы жизненного цикла короткие и вызывают именованные методы; класс объявляет интерфейс каждого хука (`implements OnInit`)
- Проверка: частично: `@angular-eslint/use-lifecycle-interface` (предупреждение в наборе `tsRecommended`); длина методов - ручное ревью.
- Источник: [Keep lifecycle methods simple](https://angular.dev/style-guide#keep-lifecycle-methods-simple) и [Use lifecycle hook interfaces](https://angular.dev/style-guide#use-lifecycle-hook-interfaces) (редакция 2025) · официальный гайд · высокая · не Яндекс.

### Y-NG-015 · SHOULD · Новый код использует standalone-компоненты, встроенный синтаксис управления потоком в шаблонах и стратегию обнаружения изменений OnPush
- Проверка: `@angular-eslint/prefer-standalone`, `@angular-eslint/prefer-on-push-component-change-detection`, `@angular-eslint/template/prefer-control-flow` (все - ошибки в наборах `tsRecommended` и `templateRecommended`).
- Источник: [ts-recommended.ts](https://github.com/angular-eslint/angular-eslint/blob/main/packages/angular-eslint/src/configs/ts-recommended.ts) и [template-recommended.ts](https://github.com/angular-eslint/angular-eslint/blob/main/packages/angular-eslint/src/configs/template-recommended.ts) (angular-eslint 22.5.0) · конфиг или инструмент · высокая · не Яндекс. В стайлгайде этих пунктов нет - это умолчания инструментов: с Angular 22 компонент без явной стратегии работает как OnPush ([CHANGELOG Angular 22.0.0](https://github.com/angular/angular/blob/main/CHANGELOG.md)).

## 4. Линтер и версии (не Яндекс)

| Пакет | Версия на 2026-10-09 | Замечание |
|---|---|---|
| `@angular/core` | 22.2.2 | Angular 22 закреплён на TypeScript 6.0.x |
| `angular-eslint` | 22.5.0 | только flat config; peer `eslint ^9.0.0 \|\| ^10.0.0`, `typescript-eslint ^8.0.0`; мажор совпадает с мажором Angular |
| `typescript-eslint` | 8.71.1 | peer `typescript >=4.8.4 <6.1.0` - TypeScript 7.x не подходит |
| `prettier` | 3.9.9 | шаблон CLI ставит `^3.8.1` |

Источники: [registry.npmjs.org/@angular/core](https://registry.npmjs.org/@angular/core/latest), [angular-eslint](https://registry.npmjs.org/angular-eslint/latest), [typescript-eslint](https://registry.npmjs.org/typescript-eslint/latest), [prettier](https://registry.npmjs.org/prettier/latest).

Angular CLI сам ESLint в новый проект не добавляет. Линтер подключается командой `ng add angular-eslint`: она создаёт `eslint.config.js` с наборами `tsRecommended`, `templateRecommended` и `templateAccessibility` и с правилами селекторов из Y-NG-007 ([README angular-eslint](https://github.com/angular-eslint/angular-eslint/blob/main/README.md#quick-start)). Правила, которые набор по умолчанию не включает и которые нужны для Y-NG-011, Y-NG-012 и Y-NG-014, дописываются в созданный файл. Имена правил - из [каталога документации `angular-eslint`](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin/docs/rules) 22.5.0; схемы их опций не читались, правила записаны без опций. Фрагмент не запускался: реестр пакетов недоступен из среды сборки.

```js
// Блок с files: ['**/*.ts'] - дописать в rules:
'@angular-eslint/use-lifecycle-interface': 'error', // Y-NG-014 (в наборе - предупреждение)
'@angular-eslint/prefer-output-readonly': 'error', // Y-NG-011
'@angular-eslint/prefer-signals': 'error', // Y-NG-011

// Блок с files: ['**/*.html'] - дописать в rules:
'@angular-eslint/template/prefer-class-binding': 'error', // Y-NG-012
'@angular-eslint/template/prefer-style-binding': 'error', // Y-NG-012
```

Интерпретация: языковые правила профиля Яндекса можно добавить в тот же файл, подключив `@gravity-ui/eslint-config` (наборы `base` и `typescript`) и `@gravity-ui/eslint-config/prettier` без React-части `/client`. По объявленным диапазонам версий сочетание допустимо: `angular-eslint` 22.5.0 работает с ESLint 9, на котором закреплён конфиг Gravity UI, а TypeScript 6.0.x попадает в диапазон `<6.1.0`. Но публичных примеров такого сочетания нет, и вместе эти конфиги не запускались, поэтому готового файла в `configs/web/` для Angular нет: [`eslint.config.js`](../../configs/web/eslint.config.js) профиля рассчитан на React.
