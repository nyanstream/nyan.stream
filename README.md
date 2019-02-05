# Исходный код сайта [NYAN.STREAM](https://nyan.stream/?from=github)

В этом репозитории находится весь исходный код фронтэнд-части сайта https://nyan.stream.  
В обычных условиях всё крутится на хостинге с Apache, при других условиях нужно взять файл `dist_content/.htaccess` и переписать под свои нужды.

### И что мне с этим делать?

* Установи [Node.js](https://nodejs.org/en/download/) и [Git](https://git-scm.com/downloads)
* Создай папку проекта и зайди в неё через терминал/командлайн
* Введи `git clone https://github.com/nyanstream/nyan.stream .`, репозиторий скачается тебе в папку
* Введи `npm install gulp-cli -g` для установки сборщика Gulp в системе
* Введи `npm install` для установки зависимостей
* Для сборки проекта введи `gulp`. Проект соберётся в директорию `dist/`, откуда его уже можно будет залить на хостинг
* Для работы над проектом (или просто чтобы посмотреть сайт в работе) введи или `gulp dev`, для завершения Ctrl+C

#### Примечания:

* Все исходные файлы (SCSS, JS, Pug...) находятся в `source/`, при сборке они сначала собираются в `build/` (можно собрать отдельно командой `gulp build`)
* Всякий "постоянный" контент вроде картиночек, robots.txt и т.д. лежит в `dist_content/`
* Команда `gulp dev` показывает в браузере сайт не из `dist/`, а из папок `build/` и `dist_content/`
* Команда `gulp` сначала выполняет сборку проекта в `build/`, затем удаляет папку `dist/` (если она есть), снова создаёт папку `dist/`, и копирует в неё содержимое `build/` и `dist_content/`

#### TODO

* RTMP/Twitch/Mixer/etc -> собственный WebRTC (как наиболее крутой вариант с минимальной задержкой)
* API на WebSocket для минимизации трафика у пользователей, да и в целом как более правильный подход (проект [Rerouch](https://github.com/nyanstream/rerouch))
* UglifyJS -> Babel (минификатор Babel конвертит всю кириллицу в ASCII, надо чинить)
* Доделать оверлей для стрима (`source/pug/apps/stream-overlay.pug`)
* Придумать, как использовать Service Worker (`source/js/service-worker.js`)
* Починить несобирающийся CSS в `gulp dev`
