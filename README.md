<header>

<div style="text-align: center">
<h1>Калита</h1>

<p>Очень безопасный модуль для вашего светлого будущего</p>

<a href="https://github.com/LetSquad/kalita">
	<img src="https://img.shields.io/github/languages/top/LetSquad/kalita?style=flat-square&logo=github" alt="GitHub top language" />
</a>
<a href="https://github.com/LetSquad/kalita/workflows/build/badge.svg">
	<img src="https://github.com/LetSquad/kalita/workflows/build/badge.svg" alt="Build" />
</a>
</div>

</header>

## Предустановки
1. Нужно предустановить node@^20.x
2. Должен быть установлен совместимый npm
3. В терминале выполнить команду npm install из папки проекта
4. Установить глобально модуль cross-env-shell с помощью команды npm install -g cross-env

## Линтеры
Для слежения за качеством кода в проекте предусмотрено подключение линтеров.

### ESLint
Для поддержки ESLint на уровне IntelliJ Idea необходимо включить его в настройках IDE. В качестве файла конфигурации
указать файл `kalita/.eslintrc`; в качестве рабочей директории `kalita`

Проверка кода с помощью ESLint стартует командой `npm run eslint` (или `npm run eslint:fix` для авто-фиксинга).

### Stylelint
Для поддержки Stylelint на уровне IntelliJ Idea необходимо включить его в настройках IDE. В качестве файла конфигурации
указать файл `kalita/.stylelintrc.json`

Проверка кода с помощью Stylelint стартует командой `npm run stylelint` (или `npm run stylelint:fix` для авто-фиксинга).

## Сборка для разработки
Стартовать дев сборку командой `npm run dev`.

После сборки автоматически запускается electron со страницей `localhost:8085` с запущенным проектом. 
Собранный проект хранится в оперативной памяти. Каждое изменение кода инициирует обновление страницы автоматически.
Доступны Chrome Dev Tools и Redux Dev Tools

## Прод сборка
Стартовать прод сборку командой `npm run prod`.

Перед сборкой автоматически запускается проверка кода с помощью ESLint. После сборки автоматически запускается electron,
загруженный из файла `kalita/app/dist/index.html` с запущенным проектом. 
Собранный проект хранится в папке `kalita/app/dist`. Недоступны Chrome Dev Tools и Redux Dev Tools

## Сборка установочного файла
Стартовать сборку установочного файла командой `npm run dist:mac` для установщика на MacOS
или стартовать сборку установочного файла командой `npm run dist:win` для установщика на Windows.

Установочный файл будет лежать в папке `kalita/dist`

