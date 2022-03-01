del /F /S /Q dist
del /F /S /Q dist.tar
del /F /S /Q dist.tar.gz

echo var version="1.0-%date:~0,10% %time%"; console.log(version);  > public/js/version.js
echo module.exports = { msg: version }  >> public/js/version.js
call npm run build:prod
set PATH="C:\Program Files\7-Zip";%PATH%
7z a dist.tar dist
7z a dist.tar.gz dist.tar
del /F /S /Q dist.tar
call ..\..\deploy\ossutil64\uploadFile.bat dist.tar.gz project-name_admin
del /F /S /Q dist.tar.gz
git add .
git commit -m "update: version" --no-verify
git push
