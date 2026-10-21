# React, Gravity UI и БЭМ в профиле «Яндекс»

> Данные актуальны на 2026-10-09.

Публичного React-стайлгайда Яндекса нет, поэтому этот документ - реконструкция по трём группам открытых источников: конфиги Gravity UI для ESLint, Prettier и Stylelint (их расширяют 15 из 16 изученных публичных JS/TS-репозиториев Яндекса), письменные правила отдельных проектов (`contribute/` и `AGENTS.md` в gravity-ui/uikit, `AGENTS.md` в ydb-embedded-ui) и методология БЭМ. Из БЭМ в React-коде остались схема имён классов `block__elem_mod_val` и принцип «один компонент - одна папка со всеми технологиями»; классы создаются только хелпером из `@bem-react/classname`. Архивный гайд команды Карт mapsapi-codestyle описан в разделе 6 как история и основой профиля не служит. В документе 21 правило области REACT и 14 правил области CSS; их проверяют три файла из [`configs/web/`](../../configs/web/).

Языковые правила TypeScript и JavaScript (форматирование, именование, импорты, типы) вынесены в [docs/languages/other.md](../languages/other.md) (правила Y-TS-001 - Y-TS-010), правила коммитов и PR - в [docs/git/commits.md](../git/commits.md). Здесь только то, что относится к React-компонентам, стилям и конфигам каталога `web/`.

## 1. Источники и их статус

| Источник | Владелец | Статус на 2026-10-09 | Роль в профиле |
|---|---|---|---|
| [`@gravity-ui/eslint-config` 4.3.2](https://github.com/gravity-ui/eslint-config/tree/v4.3.2) | Gravity UI (Яндекс) | активен, релиз 2026-06-30, ESLint 9, только flat config | основа `eslint.config.js` |
| [`@gravity-ui/prettier-config` 1.1.1](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/index.js) | Gravity UI | активен, релиз 2026-04-08; опции не менялись с 2021-11-12 | основа `.prettierrc.json` |
| [`@gravity-ui/stylelint-config` 5.0.0](https://github.com/gravity-ui/stylelint-config/tree/v5.0.0) | Gravity UI | активен, но отстаёт на мажор: релиз 2025-05-15 под Stylelint 16 при актуальном 17 | основа `.stylelintrc.json` |
| [`contribute/`](https://github.com/gravity-ui/uikit/tree/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute) и [`AGENTS.md`](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/AGENTS.md) репозитория gravity-ui/uikit | Gravity UI | активен, правки 2026-09-03 | структура компонента, публичный API, токены, i18n, тесты |
| [`eslint.config.mjs` gravity-ui/uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/eslint.config.mjs) | Gravity UI | активен, коммит a2f7a1d от 2026-10-07 | проектные React-правила поверх общего конфига |
| [`architecture.md` gravity-ui/page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/.agents/docs/architecture.md) | Gravity UI | активен, 2026-05-19 | инвариант «БЭМ + SCSS», запрет barrel-файлов |
| [`AGENTS.md` ydb-platform/ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md) | YDB | активен, коммит a2659a0 от 2026-10-08 | самый подробный письменный набор React-правил одного приложения |
| [Методология БЭМ, соглашение по именованию](https://ru.bem.info/methodology/naming-convention/) (исходник - [bem/bem-method](https://github.com/bem/bem-method/tree/78e5d110a237df0c3841a9ae48d3d760cd970c36)) | команда БЭМ (Яндекс) | активен, правки 2026-05-02 | схема имён CSS-классов |
| [`@bem-react/classname`](https://github.com/bem/bem-react/tree/f66c5865853b36e5d116bedd3c0fa6ff5de397c3/packages/classname) | bem (Яндекс) | активен: 1.8.0, тег 2026-02-27; MPL-2.0 | генерация БЭМ-классов в React |
| [yandex/mapsapi-codestyle](https://github.com/yandex/mapsapi-codestyle) и `eslint-config-loris-react` 2.0.0 | команда API Яндекс Карт | **архив с 2023-08-03**; React-конфиг не обновлялся с 2017-07-27 | только история (раздел 6) |
| [react.dev, Rules of React](https://react.dev/reference/rules) | команда React (Meta) | активен, v19.3 | альтернатива для пробелов, пометка «не Яндекс» |

Единого документа «стандарт фронтенда Яндекса» в открытом доступе нет. Описания пакетов Gravity UI содержат слова «following our styleguide», но сам этот документ не опубликован: в организации gravity-ui нет репозиториев `styleguide` или `codestyle`, а README конфигов содержат только инструкции по установке ([package.json](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/package.json), [README](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/README.md)). Поэтому правила ниже выведены из конфигов, проектных гайдов и кода. Ни один из этих источников не объявлен стандартом компании.

Выборка для долей: 16 публичных JS/TS-репозиториев (12 из организации gravity-ui, а также ydb-embedded-ui, datalens-ui, Diplodoc и yandex-cloud/nodejs-sdk), состояние HEAD на даты с 2025-04 по 2026-10. Подсчёты по коду сделаны по дереву `src/` gravity-ui/uikit на коммите [a2f7a1d](https://github.com/gravity-ui/uikit/tree/a2f7a1db051b617ca1798fddeb8fcdd44a636840). Выборка смещена к Gravity UI; о практике внутренних команд Яндекса вне этих репозиториев публичных данных не найдено.

## 2. Как назначены уровни

- `MUST` - правило включено как ошибка в конфиге, который проект-источник запускает в CI; применяется форматтером; либо записано в проектном гайде как инвариант или в повелительной форме («must», «never», «Keep…»).
- `SHOULD` - предупреждение линтера, рекомендация («prefer») или устойчивая практика кода без автоматической проверки.
- Пометка «реконструкция» стоит там, где письменного правила нет и оно выведено из кода.
- Если правило существует только как надстройка отдельных проектов, в строке «Источник» указана доля репозиториев.

## 3. Правила React

### 3.1. Компоненты и типы

### Y-REACT-001 · MUST · Компонент - функция; тип `React.FC` не используется, пропсы типизируются у параметра
- Проверка: ESLint `no-restricted-syntax` с селектором `TSTypeReference>TSQualifiedName[left.name='React'][right.name='FC']` (включено в [`eslint.config.js`](../../configs/web/eslint.config.js)); `react/prop-types` для TS-файлов выключено общим конфигом.
- Источник: [eslint.config.mjs gravity-ui/uikit, L29-L32](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/eslint.config.mjs#L29-L32) (коммит a2f7a1d, 2026-10-07) · конфиг или инструмент · средняя; [AGENTS.md ydb-embedded-ui, «Engineering rules»](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08) · производный гайд проекта · средняя. Запрет проверяет линтер в uikit, [components](https://github.com/gravity-ui/components/blob/0ebd4f2db275d5f10af92d13dcbfa7cadae89f35/.eslintrc) и [date-components](https://github.com/gravity-ui/date-components/blob/f600f3d0344bc771c486cdb6b36bec944e585a23/eslint.config.mjs), а в ydb-embedded-ui он записан в гайде (4 из 16 репозиториев); в `src/` uikit 0 вхождений `React.FC`. В приложениях landing и datalens-ui `React.FC` встречается, поэтому в источниках это правило библиотек; профиль принимает его для всего кода.
- Пример:

```tsx
// плохо
export const Label: React.FC<LabelProps> = ({children}) => <div>{children}</div>;

// хорошо
export function Label({children}: LabelProps) {
    return <div>{children}</div>;
}
```

### Y-REACT-002 · SHOULD · Пропсы описывает экспортируемый `interface <Component>Props`; у каждого поля JSDoc-комментарий, значения по умолчанию задаются деструктуризацией
- Проверка: ручное ревью; частично `@typescript-eslint/consistent-type-definitions: ['error', 'interface']` (правило включено только в репозитории самого конфига, в публикуемый набор не входит).
- Источник: [Label.tsx gravity-ui/uikit, L28-L64](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.tsx#L28-L64) (коммит a2f7a1d) · практика, выведенная из репозиториев (uikit: 200 объявлений `export interface *Props` против 90 `export type *Props`) · средняя · реконструкция; [eslint.config.js репозитория eslint-config, L21-L26](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/eslint.config.js#L21-L26) (4.3.2) · конфиг или инструмент · средняя.
- Пример:

```tsx
export interface LabelProps extends QAProps {
    /** Размер метки */
    size?: 'xs' | 's' | 'm';
    /** Дополнительный CSS-класс */
    className?: string;
    children?: React.ReactNode;
}

export function Label({size = 'xs', className, children, qa}: LabelProps) {
    return (
        <div className={b({size}, className)} data-qa={qa}>
            {children}
        </div>
    );
}
```

### Y-REACT-003 · SHOULD · Проп с фиксированным набором вариантов типизируется объединением строковых литералов, а не `enum`
- Проверка: ручное ревью.
- Источник: [Label.tsx gravity-ui/uikit, L54-L58](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.tsx#L54-L58) (коммит a2f7a1d) · практика, выведенная из репозиториев (в `src/` uikit `enum` объявлен в 6 файлах) · средняя · реконструкция.

### Y-REACT-004 · SHOULD · Компоненты экспортируются по имени; `export default` остаётся там, где его требует инструмент
- Проверка: ручное ревью.
- Источник: [Label.tsx gravity-ui/uikit, L66](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.tsx#L66) (коммит a2f7a1d) · практика, выведенная из репозиториев (в `src/` uikit вне историй Storybook `export default` есть в 26 файлах, и все 26 - `i18n/index.ts`) · средняя · реконструкция. В приложениях landing и datalens-ui default-экспорты компонентов встречаются.

### Y-REACT-005 · MUST · React импортируется одним способом во всём репозитории; профиль берёт `import * as React from 'react'`
- Проверка: ESLint `no-restricted-syntax` с селектором `ImportDeclaration[source.value='react'] :matches(ImportDefaultSpecifier, ImportSpecifier)` (включено в [`eslint.config.js`](../../configs/web/eslint.config.js)).
- Источник: [eslint.config.mjs gravity-ui/uikit, L20-L28](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/eslint.config.mjs#L20-L28) (коммит a2f7a1d, 2026-10-07) · конфиг или инструмент · средняя. Источники расходятся: uikit, [page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/.eslintrc) и [components](https://github.com/gravity-ui/components/blob/0ebd4f2db275d5f10af92d13dcbfa7cadae89f35/.eslintrc) требуют `import * as React`, а [date-components](https://github.com/gravity-ui/date-components/blob/f600f3d0344bc771c486cdb6b36bec944e585a23/eslint.config.mjs) и [ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/eslint.config.mjs) - обратного, `import React from 'react'`. Общее у всех пяти - один стиль на репозиторий, проверяемый линтером. Профиль берёт вариант uikit как самой крупной библиотеки (321 файл `.tsx` с этим импортом против одного с иным); для приложения допустим второй вариант, тогда селектор в конфиге заменяется селектором из ydb-embedded-ui.
- Пример:

```tsx
// плохо
import React, {useState} from 'react';

// хорошо
import * as React from 'react';

const [value, setValue] = React.useState('');
```

### Y-REACT-006 · SHOULD · Компонент принимает `className` и `qa`; значение `qa` попадает в атрибут `data-qa`, по которому элементы ищут тесты
- Проверка: ручное ревью.
- Источник: [types.ts gravity-ui/uikit, L3-L10](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/types.ts#L3-L10) (коммит a2f7a1d) · практика, выведенная из репозиториев (общие интерфейсы `DOMProps` и `QAProps` в uikit) · средняя · реконструкция; [AGENTS.md ydb-embedded-ui, «Engineering rules»](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08; селекторы `data-qa` в Playwright) · производный гайд проекта · средняя.

### Y-REACT-007 · SHOULD · Интерфейс собирается из компонентов Gravity UI; собственные аналоги кнопок, индикаторов загрузки и уведомлений не пишутся
- Проверка: ручное ревью.
- Источник: [AGENTS.md ydb-embedded-ui, «Engineering rules»](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08) · производный гайд проекта · средняя. Правило одного приложения. По [статье Yandex Cloud от 2023-12-12](https://medium.com/yandex/gravity-ui-easily-create-your-own-interface-32985f939f1c) библиотекой пользуются более 100 сервисов, среди них YTsaurus, YDB, DataLens и Diplodoc.

### 3.2. Хуки и состояние

### Y-REACT-008 · MUST · Хуки вызываются только на верхнем уровне компонента или пользовательского хука
- Проверка: ESLint `react-hooks/rules-of-hooks` (пресет `recommended-latest` плагина `eslint-plugin-react-hooks`, подключается через `@gravity-ui/eslint-config/client`).
- Источник: [react.js `@gravity-ui/eslint-config`, L8-L9](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/react.js#L8-L9) (4.3.2, 2026-06-30) · конфиг или инструмент · высокая.

### Y-REACT-009 · SHOULD · Массивы зависимостей `useEffect`, `useMemo` и `useCallback` перечисляют все используемые значения
- Проверка: ESLint `react-hooks/exhaustive-deps` (предупреждение; при запуске с `--max-warnings=0` блокирует CI).
- Источник: [react.js `@gravity-ui/eslint-config`, L8-L9](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/react.js#L8-L9) (4.3.2, 2026-06-30) · конфиг или инструмент · высокая.

### Y-REACT-010 · SHOULD · Состояние, которое выводится из пропсов или другого состояния, вычисляется при рендере, а не синхронизируется эффектом; мемоизация добавляется только там, где стабилизирует реальную работу
- Проверка: ручное ревью.
- Источник: [AGENTS.md ydb-embedded-ui, «Engineering rules»](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08) · производный гайд проекта · средняя; [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state) (react.dev v19.3) · официальный гайд · высокая · не Яндекс.
- Пример:

```tsx
// плохо: состояние дублирует пропсы и догоняет их эффектом
const [visibleItems, setVisibleItems] = React.useState<Item[]>([]);
React.useEffect(() => {
    setVisibleItems(items.filter((item) => item.status === status));
}, [items, status]);

// хорошо: значение вычисляется при рендере
const visibleItems = items.filter((item) => item.status === status);
```

### 3.3. JSX

### Y-REACT-011 · MUST · Фрагмент записывается как `<React.Fragment>`, сокращение `<>` не используется
- Проверка: ESLint `react/jsx-fragments: ['error', 'element']` (включено в [`eslint.config.js`](../../configs/web/eslint.config.js)).
- Источник: [eslint.config.mjs gravity-ui/uikit, L20-L28](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/eslint.config.mjs#L20-L28) (коммит a2f7a1d, 2026-10-07) · конфиг или инструмент · средняя; [AGENTS.md ydb-embedded-ui, «Engineering rules»](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08) · производный гайд проекта · средняя. В общий конфиг правило не входит; его включают 4 из 6 изученных библиотек компонентов Gravity UI (uikit, page-constructor, components, date-components), а ydb-embedded-ui проверяет то же собственным селектором.
- Пример:

```tsx
// плохо
return <>{title}</>;

// хорошо
return <React.Fragment>{title}</React.Fragment>;
```

### Y-REACT-012 · MUST · В JSX-атрибутах строки пишутся в двойных кавычках, в остальном коде - в одинарных
- Проверка: Prettier `singleQuote: true` и умолчание `jsxSingleQuote: false`; в ESLint - `prettier/prettier` через `@gravity-ui/eslint-config/prettier`.
- Источник: [index.js `@gravity-ui/prettier-config`, L6](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/index.js#L6) (1.1.1, 2026-04-08) · конфиг или инструмент · высокая; [умолчания Prettier](https://github.com/prettier/prettier/blob/main/docs/options.md) · конфиг или инструмент · высокая · не Яндекс. С архивным `eslint-config-loris-react` (`jsx-quotes: prefer-double`) правило совпадает.

### Y-REACT-013 · MUST · JSX-разметка проходит проверки доступности из набора `recommended` плагина `eslint-plugin-jsx-a11y`
- Проверка: ESLint, конфиг `@gravity-ui/eslint-config/a11y` (правила `jsx-a11y/*`).
- Источник: [a11y.js `@gravity-ui/eslint-config`](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/a11y.js) (4.3.2, 2026-06-30) · конфиг или инструмент · высокая. Конфиг подключается по желанию: он есть в uikit, page-constructor, components и date-components (не менее 4 из 15 репозиториев на конфигах Gravity UI). В uikit набор запускается в CI как ошибки, отсюда уровень MUST; сам uikit отключает одно правило - `jsx-a11y/no-autofocus`.

### 3.4. Структура компонента и пакета

### Y-REACT-014 · MUST · Компонент живёт в папке `src/components/<Component>/`; реализация `<Component>.tsx`, стили `<Component>.scss`, тесты, истории, i18n-ресурсы и README лежат в ней же
- Проверка: ручное ревью.
- Источник: [contribute/architecture.md gravity-ui/uikit, «Components»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#components) и [AGENTS.md, «Repository invariants»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/AGENTS.md#repository-invariants) (2026-09-03) · производный гайд проекта · средняя; [architecture.md gravity-ui/page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/.agents/docs/architecture.md) (2026-05-19) · производный гайд проекта · средняя.
- Пример: состав папки [`Button/`](https://github.com/gravity-ui/uikit/tree/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Button) в uikit:

```text
src/components/Button/
├── Button.tsx
├── Button.scss
├── ButtonIcon.tsx
├── constants.ts
├── types.ts
├── index.ts
├── README.md
├── README-ru.md
├── __stories__/Button.stories.tsx
├── __stories__/Docs.mdx
├── __tests__/Button.test.tsx
├── __tests__/Button.visual.test.tsx
└── __snapshots__/
```

### Y-REACT-015 · SHOULD · Файлы хуков называются `useXxx`, служебные файлы - `constants.ts`, `types.ts`, `utils.ts`; внутренние части крупного компонента лежат в его подпапках `components/`, `hooks/`, `utils/`
- Проверка: ручное ревью.
- Источник: [папка Pagination в gravity-ui/uikit](https://github.com/gravity-ui/uikit/tree/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Pagination) (коммит a2f7a1d) · практика, выведенная из репозиториев (наблюдение по uikit, без подсчёта) · средняя · реконструкция; [contribute/architecture.md, «Components»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#components) (2026-09-03) · производный гайд проекта · средняя.

### Y-REACT-016 · SHOULD · В библиотеке публичные символы экспортируются только через цепочку `index.ts`; экспорт типов и значений в `index.ts` разделён
- Проверка: ручное ревью; разделение `export type {…}` и `export {…}` поддерживает `@typescript-eslint/consistent-type-imports` вместе с опцией компилятора `verbatimModuleSyntax`.
- Источник: [contribute/architecture.md gravity-ui/uikit, «Public package surface»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#public-package-surface) (2026-09-03) · производный гайд проекта · средняя; [Button/index.ts](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Button/index.ts) (коммит a2f7a1d) · практика, выведенная из репозиториев (пример из uikit) · средняя.

В uikit это обязательное правило: новый публичный символ попадает наружу только через `index.ts` компонента, `src/components/index.ts` и `src/index.ts`; нестабильный API выносится в точку входа `unstable` с префиксом `unstable_`, устаревший - в `legacy`. Гайд page-constructor требует противоположного: для новых компонентов barrel-файлы запрещены, импорт идёт напрямую из файла реализации ([architecture.md](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/.agents/docs/architecture.md)). Профиль берёт вариант uikit для публикуемых библиотек, потому что там `index.ts` задаёт границу публичного API; в приложении barrel-файлы не обязательны. Из-за расхождения источников уровень снижен до SHOULD.

### 3.5. Тесты, Storybook, i18n

### Y-REACT-017 · SHOULD · Новая функциональность и исправление бага сопровождаются тестом; unit-тесты лежат в `__tests__/<Component>.test.tsx`, визуальные - в `__tests__/<Component>.visual.test.tsx`
- Проверка: ручное ревью; в CI - `npm run test` (в uikit Jest ищет `**/*.test.[jt]s?(x)` и пропускает файлы с `.visual.`).
- Источник: [contribute/pull-request.md gravity-ui/uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/pull-request.md) (2026-09-03) · производный гайд проекта · высокая; [jest.config.js](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/jest.config.js) и [playwright/README.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/playwright/README.md) (коммит a2f7a1d) · конфиг или инструмент · высокая. Источник формулирует наличие тестов как условие, при котором PR скорее примут, а не как категоричное требование, поэтому SHOULD. Инструмент не закреплён: uikit использует Jest 29 и Playwright Component Testing, date-components перешёл на Vitest 4.

### Y-REACT-018 · SHOULD · Истории Storybook лежат в `__stories__/<Component>.stories.tsx` в формате CSF3: `export default {…} as Meta`, тип `StoryObj`, именованные экспорты историй
- Проверка: частично ESLint `eslint-plugin-storybook`, набор `flat/recommended` (подключён в uikit, в конфиг профиля не входит); остальное - ручное ревью. В файлах `__stories__/` конфиг профиля разрешает `console`.
- Источник: [contribute/architecture.md gravity-ui/uikit, «Documentation and examples»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#documentation-and-examples) (2026-09-03) · производный гайд проекта · средняя; [Button.stories.tsx](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Button/__stories__/Button.stories.tsx) (коммит a2f7a1d) · практика, выведенная из репозиториев (пример из uikit) · средняя.

### Y-REACT-019 · MUST · Тексты, которые видит пользователь, берутся из i18n-ресурсов компонента (`i18n/en.json`, `i18n/ru.json`, `i18n/index.ts`), а не записываются в коде на одном языке
- Проверка: ручное ревью.
- Источник: [contribute/architecture.md gravity-ui/uikit, «Internationalization»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#internationalization) (2026-09-03) · производный гайд проекта · высокая; [Pagination/i18n/index.ts](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Pagination/i18n/index.ts) (коммит a2f7a1d) · практика, выведенная из репозиториев (пример из uikit) · высокая; [AGENTS.md ydb-embedded-ui, «Engineering rules»](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08) · производный гайд проекта · средняя.

### Y-REACT-020 · SHOULD · Ключ i18n строится как `<контекст>_<содержание>`: контекст - один из `action`, `alert`, `confirm`, `context`, `field`, `title`, `value`; слова содержания разделяются дефисом; HTML в текстах не используется
- Проверка: ручное ревью.
- Источник: [i18n-naming-ruleset.md ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/i18n-naming-ruleset.md) (коммит a2659a0, 2026-10-08) · производный гайд проекта · средняя. В источнике это MUST; в профиле SHOULD, потому что набор правил принадлежит одному проекту. Примеры ключей из источника: `action_document-view`, `alert_load-document-error`, `field_account-name`. Префикс `label_` источник запрещает как устаревший.

### 3.6. Чего в источниках Яндекса нет

Правил об управлении состоянием, маршрутизации, загрузке данных, обработке ошибок и логировании во фронтенде в публичных источниках Яндекса нет: публичных данных не найдено. Единственный письменный пример - стек одного приложения в `AGENTS.md` ydb-embedded-ui (React 18, Redux Toolkit, RTK Query, React Router v5). Для базовой корректности компонентов профиль берёт общепринятую альтернативу.

### Y-REACT-021 · MUST · Компоненты и хуки чистые: рендер не имеет побочных эффектов, пропсы и состояние не изменяются напрямую
- Проверка: ручное ревью. Правила `react-hooks/purity` и `react-hooks/immutability` есть в `eslint-plugin-react-hooks` 7.x, но `@gravity-ui/eslint-config` 4.3.2 зависит от диапазона `^5.2.0`, в который версия 7 не входит.
- Источник: [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) (react.dev v19.3) · официальный гайд · высокая · не Яндекс.

## 4. CSS и БЭМ

### 4.1. Место БЭМ рядом с Gravity UI

БЭМ в React-проектах Яндекса - это в первую очередь соглашение об именах CSS-классов. Gravity UI применяет его буквально: в uikit хелпер объявлен как `withNaming({n: 'g-', e: '__', m: '_'})` из `@bem-react/classname` ([cn.ts](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/utils/cn.ts#L1-L8)), пакет `@bem-react/classname` - прямая зависимость uikit, а вызов `block('…')` встречается в 153 файлах `src/`. В выборке из 10 React-репозиториев со стилями БЭМ-хелпер с разделителями `__` и `_` используют все 10: семь - `@bem-react/classname`, три (datalens-ui, landing, gravity-ui-vite-example) - стороннюю библиотеку `bem-cn-lite`.

Что из методологии используется, а что нет (интерпретация по коду uikit и по тексту [методологии](https://ru.bem.info/methodology/filestructure/)):

| Часть БЭМ | В React-проектах на Gravity UI | Свидетельство |
|---|---|---|
| Схема имён `block__elem_mod_val` | используется | [cn.ts](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/utils/cn.ts#L1-L8), [Label.scss](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.scss) |
| Все технологии блока лежат в одной папке, файлы названы по блоку | используется как «один компонент - одна папка» (Y-REACT-014) | [contribute/architecture.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#components) |
| Отдельный файл на каждый элемент и модификатор | не используется: один `.scss` на компонент (Y-CSS-005) | [Label.scss](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.scss) |
| Уровни переопределения | не используются; темы заданы CSS-переменными | [contribute/architecture.md, «Styles and themes»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#styles-and-themes) |
| i-bem.js, BEMHTML, сборщик ENB | не используются | [package.json uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/package.json) |
| Модификаторы как компоненты высшего порядка (`@bem-react/core`), DI | в Gravity UI нет; есть в «Лего» (`@yandex/ui`) | [bem/yandex-ui](https://github.com/bem/yandex-ui/tree/70f228bf2de057d74e935162bcc23a6506ddcc85) |

В открытом коде сосуществуют две схемы БЭМ для React. Gravity UI использует классическую: `g-button__icon_side_start`. Библиотека «Лего» (`@yandex/ui` 3.34.0, MPL-2.0) использует React-схему `Button-Icon_side_left` и раскладку файлов по элементам (`Icon/Button-Icon.tsx`), но фактически не развивается: последний релиз вышел 2024-02-27 ([bem/yandex-ui](https://github.com/bem/yandex-ui/tree/70f228bf2de057d74e935162bcc23a6506ddcc85)). React-схема - умолчание `@bem-react/classname`; классическая включается через `withNaming` ([README пакета](https://github.com/bem/bem-react/blob/f66c5865853b36e5d116bedd3c0fa6ff5de397c3/packages/classname/README.md)). Профиль берёт классическую схему, потому что ей следует активно развиваемая библиотека.

Статус самих БЭМ-проектов на 2026-10-09: методология правилась 2026-05-02, тогда же в репозиторий добавлена лицензия MIT ([bem/bem-method](https://github.com/bem/bem-method/tree/78e5d110a237df0c3841a9ae48d3d760cd970c36)); `bem-core` 5.0.0 вышел 2026-03-22 после паузы с 2018 года ([CHANGELOG](https://github.com/bem/bem-core/blob/7a9e9327a56d70957778260d3e9413d9fa6e6e7f/CHANGELOG.md)); `@bem-react/core` 6.0.0 от 2026-02-06 перешёл на React 19 ([bem/bem-react](https://github.com/bem/bem-react/tree/f66c5865853b36e5d116bedd3c0fa6ff5de397c3)). Сборщик `enb`, `bem-xjst` и `bem-sdk` не обновляются с 2018-2021 годов. Страница [«БЭМ - Технологии Яндекса»](https://yandex.ru/dev/bem/) сообщает, что БЭМ используется в Яндексе для разработки фронтенда. Как соотносятся БЭМ-стек, «Лего» и Gravity UI внутри компании - публичных данных не найдено.

### 4.2. Правила

### Y-CSS-001 · MUST · Имена классов строятся по схеме БЭМ `block-name__elem-name_mod-name_mod-val`: латиница в нижнем регистре, слова через дефис, элемент после `__`, модификатор и его значение после `_`; у булева модификатора значения нет
- Проверка: ручное ревью. Линтера БЭМ-имён в конфигах Gravity UI нет: `@gravity-ui/stylelint-config` не содержит `selector-class-pattern`. На практике схему обеспечивает хелпер (Y-CSS-003).
- Источник: [Соглашение по именованию, «Правила формирования имен»](https://github.com/bem/bem-method/blob/78e5d110a237df0c3841a9ae48d3d760cd970c36/method/naming-convention/naming-convention.ru.md) (ревизия 2026-05-02; на сайте - [ru.bem.info](https://ru.bem.info/methodology/naming-convention/)) · официальный гайд · высокая.
- Пример: `g-label`, `g-label__addon`, `g-label__addon_side_end`, `g-label_disabled`.

### Y-CSS-002 · MUST · Элементов элементов не бывает: `block__elem1__elem2` запрещено, вложенность в DOM не отражается в имени
- Проверка: ручное ревью.
- Источник: [Соглашение по именованию, «Правила формирования имен»](https://github.com/bem/bem-method/blob/78e5d110a237df0c3841a9ae48d3d760cd970c36/method/naming-convention/naming-convention.ru.md) (ревизия 2026-05-02) · официальный гайд · высокая.
- Пример:

```scss
// плохо
.app-menu__item__icon {
}

// хорошо
.app-menu__item-icon {
}
```

### Y-CSS-003 · MUST · Имена классов в компонентах создаются только хелпером `block()` из `@bem-react/classname` с классическими разделителями; вручную строки классов не собираются
- Проверка: ручное ревью (линтера нет).
- Источник: [architecture.md gravity-ui/page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/.agents/docs/architecture.md) (2026-05-19) · производный гайд проекта · высокая; [cn.ts gravity-ui/uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/utils/cn.ts#L1-L8) (коммит a2f7a1d) · практика, выведенная из репозиториев (БЭМ-хелпер в 10 из 10 React-репозиториев со стилями; `@bem-react/classname` - в 7 из 10) · высокая; [AGENTS.md ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08) · производный гайд проекта · высокая.
- Пример:

```tsx
// плохо: класс собран вручную
return <div className={`label__addon ${side === 'end' ? 'label__addon_side_end' : ''}`} />;

// хорошо: block() из src/utils/cn.ts; при side === 'end' получится
// «app-label__addon app-label__addon_side_end»
const b = block('label');

return <div className={b('addon', {side})} />;
```

### Y-CSS-004 · SHOULD · Имя блока начинается с префикса проекта, общего для всех блоков пакета
- Проверка: ручное ревью; префикс задаётся один раз в `withNaming({n: '<префикс>-', …})` и в SCSS-переменной `$ns`.
- Источник: [cn.ts](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/utils/cn.ts#L1-L8) и [variables.scss](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/variables.scss) gravity-ui/uikit (коммит a2f7a1d) · практика, выведенная из репозиториев (префикс есть во всех 6 изученных библиотеках Gravity UI: `g-`, `gn-`, `gc-`, `pc-`, `g-date-`, `g-md-`) · высокая; [AGENTS.md ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/AGENTS.md#engineering-rules) (2026-10-08; префикс `ydb-`) · производный гайд проекта · высокая.

Источники расходятся. Редакция методологии от 2026-05-02 говорит, что префиксы блоков вроде `b-`, `c-`, `g-` не нужны: имя блока само задаёт пространство имён ([коммит 57bc011](https://github.com/bem/bem-method/commit/57bc011)). Gravity UI всегда добавляет префикс пакета, а ydb-embedded-ui требует его и для приложения. Профиль берёт вариант Gravity UI: стили библиотеки попадают на чужие страницы, и префикс защищает от совпадения имён. Из-за расхождения уровень - SHOULD.

### Y-CSS-005 · SHOULD · У компонента один SCSS-файл рядом с `.tsx`; вложенность в нём повторяет БЭМ-дерево: `&__elem`, `&_mod { &_val {…} }`
- Проверка: ручное ревью; синтаксис SCSS разбирает Stylelint (`customSyntax: postcss-scss`, `scss/at-rule-no-unknown`).
- Источник: [Label.scss gravity-ui/uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.scss) (коммит a2f7a1d) · практика, выведенная из репозиториев (наблюдение по uikit, без подсчёта) · средняя · реконструкция; [architecture.md gravity-ui/page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/.agents/docs/architecture.md) (2026-05-19) · производный гайд проекта · высокая.
- Пример:

```scss
@use '../variables';

$block: '.#{variables.$ns}label';

#{$block} {
    display: inline-flex;

    &__text {
        overflow: hidden;
    }

    &_size {
        &_m {
            height: 28px;
        }
    }

    &_disabled {
        opacity: 0.5;
    }
}
```

### Y-CSS-006 · MUST · `!important` не используется
- Проверка: Stylelint `declaration-no-important`.
- Источник: [index.js `@gravity-ui/stylelint-config`, L25-L49](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/index.js#L25-L49) (5.0.0, 2025-05-15) · конфиг или инструмент · высокая. ydb-embedded-ui это правило отключает ([.stylelintrc](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/.stylelintrc)).

### Y-CSS-007 · MUST · Вендорные префиксы вручную не пишутся - ни у свойств, ни у значений, селекторов, медиа-признаков и at-правил
- Проверка: Stylelint `property-no-vendor-prefix`, `value-no-vendor-prefix`, `selector-no-vendor-prefix`, `media-feature-name-no-vendor-prefix`, `at-rule-no-vendor-prefix`.
- Источник: [index.js `@gravity-ui/stylelint-config`, L25-L49](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/index.js#L25-L49) (5.0.0, 2025-05-15) · конфиг или инструмент · высокая.

### Y-CSS-008 · MUST · Цвет не задаётся именем (`red`, `white`)
- Проверка: Stylelint `color-named: 'never'`; опечатки в hex-записи ловит `color-no-invalid-hex`.
- Источник: [index.js `@gravity-ui/stylelint-config`, L25-L49](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/index.js#L25-L49) (5.0.0, 2025-05-15) · конфиг или инструмент · высокая.

### Y-CSS-009 · MUST · В проекте на темах Gravity UI цвета берутся из семантических токенов `--g-color-base-*`, `--g-color-text-*`, `--g-color-line-*`; токены палитры `--g-color-private-*` напрямую не используются
- Проверка: ручное ревью.
- Источник: [contribute/architecture.md gravity-ui/uikit, «Styles and themes»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/contribute/architecture.md#styles-and-themes) и [AGENTS.md, «Repository invariants»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/AGENTS.md#repository-invariants) (2026-09-03) · производный гайд проекта · высокая. Тот же инвариант советует брать из токенов отступы, типографику и радиусы вместо жёстко заданных значений.

### Y-CSS-010 · MUST · В селекторе не больше одного id и одного универсального селектора; в однострочном блоке - не больше одной декларации
- Проверка: Stylelint `selector-max-id: 1`, `selector-max-universal: 1`, `declaration-block-single-line-max-declarations: 1`.
- Источник: [index.js `@gravity-ui/stylelint-config`, L25-L49](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/index.js#L25-L49) (5.0.0, 2025-05-15) · конфиг или инструмент · высокая.

### Y-CSS-011 · SHOULD · Содержимое блока идёт в порядке: `$`-переменные, пользовательские свойства, декларации, at-правила, вложенные правила, `@media`; свойства сгруппированы: позиционирование, отображение и flex/grid, блочная модель, таблицы и списки, типографика, оформление, анимация
- Проверка: Stylelint `order/order`, `order/properties-order` (плагин `stylelint-order`, конфиг `@gravity-ui/stylelint-config/order`; включён в [`.stylelintrc.json`](../../configs/web/.stylelintrc.json)).
- Источник: [order.js `@gravity-ui/stylelint-config`](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/order.js) (5.0.0, 2025-05-15) · конфиг или инструмент · средняя. Конфиг подключается по желанию: он есть в date-components, markdown-editor и ydb-embedded-ui (3 из 11 репозиториев со стилями), uikit его не использует. Отсюда SHOULD.

### Y-CSS-012 · SHOULD · Там, где важно направление письма, используются логические свойства (`margin-inline-start`, `inset-inline-end`), а не физические (`margin-left`, `right`)
- Проверка: Stylelint `csstools/use-logical` (плагин `stylelint-use-logical`; в конфиг профиля не включён, сниппет - в разделе 5.4).
- Источник: [.stylelintrc gravity-ui/uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/.stylelintrc) (коммит a2f7a1d) · конфиг или инструмент · средняя; [AGENTS.md gravity-ui/uikit, «Repository invariants»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/AGENTS.md#repository-invariants) (2026-09-03) · производный гайд проекта · высокая. В uikit это инвариант ради поддержки RTL и ошибка линтера; в профиле SHOULD, потому что плагин не входит в общий конфиг и подключён в 3 из 11 репозиториев со стилями (uikit, components, date-components).
- Пример:

```scss
// плохо
margin-left: 8px;

// хорошо
margin-inline-start: 8px;
```

### Y-CSS-013 · SHOULD · Внутренние CSS-переменные компонента называются `--_--<имя>`, публичные (CSS API) - `--<префикс>-<компонент>-<свойство>`; публичная подставляется с запасным значением из внутренней
- Проверка: ручное ревью.
- Источник: [Button.scss gravity-ui/uikit, L6-L22](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Button/Button.scss#L6-L22) и [Button/README.md, «CSS API»](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Button/README.md#css-api) (коммит a2f7a1d) · практика, выведенная из репозиториев (наблюдение по uikit, без подсчёта) · средняя · реконструкция.
- Пример:

```scss
#{$block} {
    --_--height: 28px;

    height: var(--g-button-height, var(--_--height));
}
```

### Y-CSS-014 · MUST · SCSS форматируется Prettier с теми же настройками, что и код: отступ 4 пробела, одинарные кавычки
- Проверка: Stylelint `prettier/prettier` (плагин `stylelint-prettier`, конфиг `@gravity-ui/stylelint-config/prettier`; включён в [`.stylelintrc.json`](../../configs/web/.stylelintrc.json)); настройки читаются из [`.prettierrc.json`](../../configs/web/.prettierrc.json).
- Источник: [prettier.js `@gravity-ui/stylelint-config`](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/prettier.js) (5.0.0, 2025-05-15) · конфиг или инструмент · высокая. Конфиг подключён в uikit, components, date-components, markdown-editor и ydb-embedded-ui.

### 4.3. Что ещё проверяет базовый Stylelint-конфиг

Эти проверки очевидны и отдельными правилами профиля не оформлены. Все они - из [index.js `@gravity-ui/stylelint-config` 5.0.0](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/index.js#L3-L51); готовые наборы вроде `stylelint-config-standard` пакет не расширяет, правила перечислены в нём вручную.

| Группа | Правила Stylelint |
|---|---|
| Неизвестные сущности | `property-no-unknown`, `unit-no-unknown`, `selector-pseudo-class-no-unknown`, `selector-pseudo-element-no-unknown`, `selector-type-no-unknown`, `media-feature-name-no-unknown`, `no-unknown-animations`, `scss/at-rule-no-unknown` |
| Дубли и избыточность | `declaration-block-no-duplicate-properties`, `declaration-block-no-redundant-longhand-properties`, `declaration-block-no-shorthand-property-overrides`, `shorthand-property-no-redundant-values`, `font-family-no-duplicate-names` |
| Ошибки записи | `color-no-invalid-hex`, `function-calc-no-unspaced-operator`, `function-linear-gradient-no-nonstandard-direction`, `string-no-newline` |
| Регистр и пустые строки | `value-keyword-case: 'lower'` (с `camelCaseSvgKeywords`), `selector-type-case: 'lower'`, `rule-empty-line-before`, `at-rule-empty-line-before` |

## 5. Конфиги `configs/web/`

### 5.1. Версии и происхождение

JSON не допускает комментариев, поэтому версии и происхождение двух JSON-файлов записаны здесь; у `eslint.config.js` те же сведения продублированы в заголовке файла.

| Файл | Инструмент | Пакеты и версии | Откуда взято содержимое | Что проверено локально |
|---|---|---|---|---|
| [`eslint.config.js`](../../configs/web/eslint.config.js) | ESLint 9.x (`^9.38.0`), flat config | `@gravity-ui/eslint-config` `^4.3.2` (MIT) | состав и порядок - из [eslint.config.mjs gravity-ui/uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/eslint.config.mjs) (MIT); возврат `curly` - из [eslint.config.mjs ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/eslint.config.mjs) (Apache-2.0) | `node --check`; загрузка и схема - на ESLint 10.1.0 с заглушками вместо пакетов Gravity UI. Настоящие плагины не запускались |
| [`.prettierrc.json`](../../configs/web/.prettierrc.json) | Prettier 3.x (`^3.5.3`) | пакеты не нужны; источник опций - `@gravity-ui/prettier-config` 1.1.1 (MIT, © 2021 YANDEX LLC) | опции перенесены дословно из [index.js](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/index.js#L1-L24) | Prettier 3.8.1: файл разобран, пробные `.tsx`, `.scss`, `.json` отформатированы ожидаемо, `prettier --check` самих конфигов проходит |
| [`.stylelintrc.json`](../../configs/web/.stylelintrc.json) | Stylelint 16.x (`^16.25.0`, не ниже 16.18.0), PostCSS 8 (`^8.5.6`), Node.js ≥ 20 | `@gravity-ui/stylelint-config` `^5.0.0` (MIT) | состав `extends` - из [README пакета](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/README.md); ровно такой набор в [date-components](https://github.com/gravity-ui/date-components/blob/f600f3d0344bc771c486cdb6b36bec944e585a23/.stylelintrc.json) и [ydb-embedded-ui](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/.stylelintrc) | только разбор JSON. Stylelint не запускался: реестр пакетов недоступен из среды сборки |

Диапазоны версий инструментов взяты из `package.json` gravity-ui/uikit на коммите [a2f7a1d](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/package.json): `eslint ^9.38.0`, `stylelint ^16.25.0`, `postcss ^8.5.6`, `prettier ^3.5.3`, `typescript ^5.9.3`.

Два ограничения по версиям нужно знать заранее:

- **ESLint закрепляется на мажоре 9, Stylelint - на мажоре 16.** Актуальные мажоры на 2026-10-09 - ESLint 10.12.0 и Stylelint 17.16.0, то есть связка Gravity UI отстаёт на один мажор по обоим инструментам. `@gravity-ui/eslint-config` 4.3.2 собран под ESLint 9 (`@eslint/js ^9.23.0`), а его зависимость `eslint-plugin-import` 2.32.0 объявляет совместимость только до ESLint 9; у `@gravity-ui/stylelint-config` 5.0.0 peer-зависимость `stylelint ^16.18.0` ([package.json eslint-config](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/package.json), [package.json stylelint-config](https://github.com/gravity-ui/stylelint-config/blob/v5.0.0/package.json)). Все изученные репозитории на конфиге v4 закрепляют ESLint 9.x. Работа под ESLint 10 и Stylelint 17 не проверялась. Дата окончания поддержки ESLint 9 - 2026-08-06 ([eslint.org/version-support](https://eslint.org/version-support/), проверено 2026-10-16; то же в [документации angular-eslint](https://github.com/angular-eslint/angular-eslint/blob/main/docs/CONFIGURING_ESLINT.md)), так что профиль наследует от источника мажор, который уже не поддерживается.
- **TypeScript должен попадать в диапазон `>=4.8.4 <6.1.0`** (peer-зависимость `@gravity-ui/eslint-config`); версия 7.x не подходит.

### 5.2. `eslint.config.js`

Файл подключает пять точек входа пакета в порядке uikit и добавляет проектные правила.

| Элемент конфига | Что даёт | Правила профиля |
|---|---|---|
| `@gravity-ui/eslint-config` | наборы `base` и `typescript`: `@eslint/js` recommended, `eslint-plugin-jsdoc`, правила `@typescript-eslint/*`, `import/no-duplicates` | Y-TS-002, Y-TS-004, Y-TS-007 - Y-TS-009 в [other.md](../languages/other.md) |
| `…/client` | `eslint-plugin-react` recommended, `eslint-plugin-react-hooks` recommended-latest, глобальные имена браузера | Y-REACT-008, Y-REACT-009 |
| `…/prettier` | `eslint-plugin-prettier/recommended`: форматирование как ошибка ESLint | Y-TS-001, Y-REACT-012 |
| `…/import-order` | `import/order`: `react` первым среди внешних пакетов, стили и ассеты - последними | Y-TS-006 |
| `…/a11y` | `eslint-plugin-jsx-a11y` recommended | Y-REACT-013 |
| `curly: ['error', 'all']` | возвращает правило, которое выключает `eslint-config-prettier` | Y-TS-003 |
| `react/jsx-fragments`, `no-restricted-syntax` | проектные правила uikit | Y-REACT-011, Y-REACT-005, Y-REACT-001 |
| `import/consistent-type-specifier-style`, `@typescript-eslint/consistent-type-imports` | типы импортируются отдельной инструкцией `import type {…}` | отдельным правилом не оформлено: надстройка 6 из 16 репозиториев |
| блок для `**/__stories__/**` | разрешает `console` в историях | Y-REACT-018 |

Особенности, которые легко пропустить:

- README пакета описывает только корневую точку входа, `/prettier`, `/a11y` и `/import-order`. Точки входа `/client`, `/react` и `/server` экспортируются, но в README не упомянуты; их использование видно в uikit и в тестах самого пакета ([README](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/README.md), [client.js](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/client.js)).
- Правило `curly` объявлено в `base.js` как ошибка, но после подключения `/prettier` перестаёт действовать: его выключает `eslint-config-prettier`. Сообщение об этом открыто с 2025-10-24 без ответа ([issue #44](https://github.com/gravity-ui/eslint-config/issues/44)). Конфиг профиля возвращает правило явно, как это делает ydb-embedded-ui.
- Пакет - только ESM, поэтому файл конфига должен быть ES-модулем: либо `"type": "module"` в `package.json`, либо имя `eslint.config.mjs`.
- Для серверного кода на Node.js вместо `/client` и `/a11y` подключается `@gravity-ui/eslint-config/server`: он добавляет глобальные имена Node.js и 11 правил `eslint-plugin-security` ([server.js](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/server.js), пример - [nodekit](https://github.com/gravity-ui/nodekit/blob/b88cc97ef584818a159a2eab7b6133257ecae10f/eslint.config.mjs)).
- Часть правил общего конфига - предупреждения (`eqeqeq`, `no-implicit-coercion`, `react-hooks/exhaustive-deps`). Чтобы они блокировали слияние, ESLint в CI запускается с `--max-warnings=0`, как в [page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/package.json).

Миграция на flat config в самих репозиториях Яндекса не завершена: из 15 репозиториев на конфигах Gravity UI на v4 и ESLint 9 перешли 5, остальные остаются на v2-v3 с ESLint 8 и `.eslintrc`. Вариант для такого проекта (`@gravity-ui/eslint-config@^3.3.0`, файл `.eslintrc`) - из [README v3.3.0](https://github.com/gravity-ui/eslint-config/blob/v3.3.0/README.md):

```json
{
  "extends": [
    "@gravity-ui/eslint-config",
    "@gravity-ui/eslint-config/client",
    "@gravity-ui/eslint-config/prettier",
    "@gravity-ui/eslint-config/import-order",
    "@gravity-ui/eslint-config/a11y"
  ],
  "root": true
}
```

### 5.3. `.prettierrc.json`

Файл автономный: пять опций и два блока `overrides` один в один повторяют `index.js` пакета `@gravity-ui/prettier-config` 1.1.1, сам пакет ставить не нужно. Опции в источнике не менялись с первого коммита 2021-11-12 ([9dc527d](https://github.com/gravity-ui/prettier-config/commit/9dc527d)), поэтому риск разойтись с пакетом мал.

| Опция | Значение | Умолчание Prettier 3 |
|---|---|---|
| `tabWidth` | 4 (для `*.md`, `*.json`, `*.yaml`, `*.yml` - 2) | 2 |
| `printWidth` | 100 | 80 |
| `singleQuote` | `true` | `false` |
| `bracketSpacing` | `false`: `{a: 1}`, `import {a} from 'x'` | `true` |
| `trailingComma` | `"all"` | `"all"` |
| `overrides[0].options.parser` | `"typescript"` для `*.js`, `*.jsx`, `*.ts`, `*.tsx` | по расширению файла |

Остальное берётся из умолчаний Prettier: `semi: true`, `jsxSingleQuote: false`, `arrowParens: "always"`, `quoteProps: "as-needed"`, `endOfLine: "lf"` ([документация Prettier](https://github.com/prettier/prettier/blob/main/docs/options.md)).

Варианты подключения, которые встречаются в репозиториях Gravity UI и дают тот же результат при установленном пакете `@gravity-ui/prettier-config`: файл `.prettierrc.js` с содержимым `module.exports = require('@gravity-ui/prettier-config');` (форма из [README](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/README.md), так в uikit) или файл `.prettierrc.json`, весь текст которого - строка `"@gravity-ui/prettier-config"` (так в [app-builder](https://github.com/gravity-ui/app-builder/blob/f728685e157bda550c9177a669006c1e366de7af/.prettierrc.json)). Профиль выбрал автономный файл, чтобы форматирование работало без `node_modules`, например в хуке pre-commit.

### 5.4. `.stylelintrc.json`

Файл расширяет три конфига пакета `@gravity-ui/stylelint-config` 5.0.0:

| Конфиг | Содержимое | Правила профиля |
|---|---|---|
| `@gravity-ui/stylelint-config` | синтаксис `postcss-scss`, плагин `stylelint-scss`, 32 правила, перечисленных вручную (31 включено, встроенное `at-rule-no-unknown` выключено в пользу `scss/at-rule-no-unknown`) | Y-CSS-006 - Y-CSS-008, Y-CSS-010, таблица 4.3 |
| `…/order` | плагин `stylelint-order`: порядок содержимого блока и свойств | Y-CSS-011 |
| `…/prettier` | плагин `stylelint-prettier`: форматирование SCSS по `.prettierrc.json` | Y-CSS-014 |

Плагины `postcss-scss`, `stylelint-scss`, `stylelint-order` и `stylelint-prettier` - зависимости пакета, отдельно их ставить не нужно. Минимальный вариант uikit обходится без `/order`.

Для правила Y-CSS-012 uikit, components и date-components добавляют плагин `stylelint-use-logical` (`^2.1.2`). Сниппет из [.stylelintrc uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/.stylelintrc) - эти два ключа дописываются в `.stylelintrc.json` рядом с `extends`:

```json
{
  "plugins": ["stylelint-use-logical"],
  "rules": {
    "csstools/use-logical": [
      "always",
      {"except": ["float", "width", "min-width", "max-width", "height", "min-height", "max-height"]}
    ]
  }
}
```

### 5.5. Установка и запуск

```sh
npm install --save-dev eslint@^9.38.0 @gravity-ui/eslint-config@^4.3.2 \
    prettier@^3.5.3 \
    stylelint@^16.25.0 postcss@^8.5.6 @gravity-ui/stylelint-config@^5.0.0 \
    typescript@^5.9.3
npm install @bem-react/classname@^1.8.0

npx eslint . --max-warnings=0            # *.js, *.ts, *.tsx; форматирование проверяет prettier/prettier
npx stylelint "src/**/*.scss"            # стили
npx prettier --check "**/*.{md,json,yaml,yml}"
npx tsc --noEmit                         # проверка типов
```

Плагины ESLint (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`, `@typescript-eslint/*`) ставить отдельно не нужно - это зависимости `@gravity-ui/eslint-config`. В uikit те же проверки собраны в скрипты `lint:js`, `lint:styles`, `lint:prettier` и `typecheck`, а CI запускает `npm run lint` и `npm run typecheck` ([ci.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/.github/workflows/ci.yml)). Перед коммитом uikit запускает `nano-staged` через husky: `stylelint --fix` для `*.scss`, `eslint --fix` для `*.{js,jsx,ts,tsx}`, `prettier --write` для `*.{md,mdx}`.

### 5.6. Сопутствующие файлы

Хелпер БЭМ-классов (`src/utils/cn.ts`), как в uikit, но со своим префиксом:

```ts
import {withNaming} from '@bem-react/classname';

export const NAMESPACE = 'app-';
export const block = withNaming({n: NAMESPACE, e: '__', m: '_'});
```

`tsconfig.json`: базовый `@gravity-ui/tsconfig` 1.0.0 не обновляется с 2022 года, и из него полезны только флаги строгости (`strict`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noEmitOnError`). Параметры `target`, `module` и `moduleResolution` все живые проекты переопределяют. Вариант [uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/tsconfig.json); `"jsx": "react-jsx"` нужен, чтобы работало отключение `react/react-in-jsx-scope`:

```json
{
  "extends": "@gravity-ui/tsconfig/tsconfig.json",
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

Целевые браузеры: `"browserslist": ["extends @gravity-ui/browserslist-config"]` в `package.json` (пакет 5.0.0 от 2026-06-22, единственный запрос - `baseline widely available on 2025-01-01 with downstream`; [README](https://github.com/gravity-ui/browserslist-config/blob/0802731761fce0fe833633b68f769becbe8aaaae/README.md)). Запрет вендорных префиксов (Y-CSS-007) предполагает, что их расставляет сборка по этому списку.

## 6. История: mapsapi-codestyle (архив)

[yandex/mapsapi-codestyle](https://github.com/yandex/mapsapi-codestyle) - командный гайд API Яндекс Карт по JavaScript и TypeScript. Репозиторий заархивирован 2023-08-03; текст не менялся с 2018-2019 годов. Основой профиля он не служит, но объясняет, откуда взялись нынешние форматные решения.

React в этом гайде представлен только конфигом `eslint-config-loris-react` 2.0.0 (2017-07-27, MIT, не обновляется), прозы о React нет, о CSS нет ничего. Конфиг требовал: компоненты - ES6-классы или функции без состояния, `prop-types` обязательны, булев проп пишется без значения, файлы с JSX имеют расширение `.jsx`, строки в JSX - в двойных кавычках ([index.js](https://github.com/yandex/mapsapi-codestyle/blob/d549f85deb7ed7d90e3b302478fc50dd950447e0/packages/eslint-config-loris-react/index.js)).

Расхождения с Gravity UI, заметные в React-проекте (источник архивный; языковые правила - в [other.md](../languages/other.md)):

| Параметр | mapsapi-codestyle (архив, 2017-2019) | Gravity UI (2026) | Профиль |
|---|---|---|---|
| React-компоненты | классы ES6 или функции без состояния, `prop-types` обязательны | функции и хуки; `react/prop-types` для TS выключено | Gravity UI (Y-REACT-001) |
| Кавычки в JSX | двойные (`jsx-quotes: prefer-double`) | двойные (умолчание Prettier) | совпадают (Y-REACT-012) |
| Длина строки | 120, жёсткий лимит `max-len` | 100, `printWidth` | Gravity UI |
| Висячие запятые | запрещены (`comma-dangle: never`) | обязательны (`trailingComma: 'all'`) | Gravity UI |
| Отступ, одинарные кавычки, точка с запятой, `{a: 1}` без пробелов | 4 пробела, `'…'`, `;`, без пробелов | то же | совпадают |
| Инструмент | ESLint 4, TSLint 5 | ESLint 9, typescript-eslint 8 | Gravity UI |

Во всех конфликтных пунктах профиль берёт Gravity UI: это действующие конфиги, которые расширяют 15 из 16 изученных репозиториев, а значения mapsapi-codestyle существуют только в архивном источнике. Базовые форматные решения (4 пробела, одинарные кавычки, точки с запятой, объекты без пробелов у скобок) прошли без изменений от исторического JSCS-пресета `yandex` 2014 года ([presets/yandex.json](https://github.com/jscs-dev/node-jscs/blob/1072662190c403e5726c7a699f0647cda5446a8e/presets/yandex.json), удалён из JSCS в 2016 году) до конфигов Gravity UI; изменились длина строки и висячие запятые.

У гайда три разные лицензии: текст `javascript.md` - CC BY-SA 4.0 (указано в самом документе), корневой файл `LICENSE` репозитория - Apache-2.0 (добавлен 2023-07-19), npm-пакеты - MIT. Дословных фрагментов из него в этом документе нет.

## 7. Сводка: что проверяет инструмент

| Способ проверки | Правила |
|---|---|
| ESLint, общий конфиг Gravity UI | Y-REACT-008, Y-REACT-009, Y-REACT-013 |
| ESLint, проектные правила из `eslint.config.js` | Y-REACT-001, Y-REACT-005, Y-REACT-011 |
| Prettier (через ESLint и Stylelint) | Y-REACT-012, Y-CSS-014 |
| Stylelint, конфиг профиля | Y-CSS-006, Y-CSS-007, Y-CSS-008, Y-CSS-010, Y-CSS-011 |
| Stylelint, плагин по желанию | Y-CSS-012 |
| Частично инструмент (в том числе правилами, которые подключаются отдельно), остальное - ревью | Y-REACT-002, Y-REACT-016, Y-REACT-017, Y-REACT-018, Y-CSS-005 |
| Только ручное ревью | Y-REACT-003, Y-REACT-004, Y-REACT-006, Y-REACT-007, Y-REACT-010, Y-REACT-014, Y-REACT-015, Y-REACT-019, Y-REACT-020, Y-REACT-021, Y-CSS-001, Y-CSS-002, Y-CSS-003, Y-CSS-004, Y-CSS-009, Y-CSS-013 |

Из 35 правил инструмент полностью проверяет 14 (одно из них - плагином, который в конфиг профиля не включён), частично - 5, только ревью остаётся для 16. Самое значимое непроверяемое правило - БЭМ-именование (Y-CSS-001 - Y-CSS-003): публичного линтера для него в связке Gravity UI нет, схему удерживает хелпер `block()`.

## 8. Чего в публичных источниках нет

- Единого стайлгайда фронтенда Яндекса и прозаического стайлгайда Gravity UI - публичных данных не найдено.
- Правил архитектуры React-приложений (состояние, маршрутизация, загрузка данных, обработка ошибок) - публичных данных не найдено. Альтернатива «не Яндекс»: документация [react.dev](https://react.dev/reference/rules).
- Линтера БЭМ-имён классов в конфигах Gravity UI. Интерпретация: встроенное правило Stylelint `selector-class-pattern` («не Яндекс») к SCSS в стиле uikit применимо плохо, потому что корневой селектор там задан интерполяцией `#{$block}`.
- Письменного руководства по API компонентов (имена пропсов `view`, `size`, `pin`, `onUpdate` против `onChange`): закономерности видны только в коде uikit.
- Учебных хендбуков Яндекса по фронтенду, JavaScript или React: на [contest.yandex.ru/tracks](https://contest.yandex.ru/tracks) восемь хендбуков, ближайший по теме - Flutter. Учебные материалы стандартом не являются.
- Практик для Angular - см. [angular.md](angular.md).
