#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://api.salahnsujood.online}"

echo "Verifying $BASE_URL"
echo

curl -fsS "$BASE_URL/health"
echo
echo

curl -fsS "$BASE_URL/api/quran/surahs" >/dev/null
echo "Quran surahs: OK"

curl -fsS "$BASE_URL/api/quran/surah/1/with-translation?translation=en.sahih" >/dev/null
echo "Quran translation: OK"

curl -fsS "$BASE_URL/api/quran/translations" >/dev/null
echo "Translations list: OK"

curl -fsS "$BASE_URL/api/quran/reciters" >/dev/null
echo "Reciters list: OK"

curl -fsS "$BASE_URL/api/quran/surah/1/audio?reciter=ar.alafasy" >/dev/null
echo "Audio endpoint: OK"

curl -fsS "$BASE_URL/api/prayer/hijri" >/dev/null
echo "Hijri endpoint: OK"

curl -fsS "$BASE_URL/api/prayer/times?city=London&country=United%20Kingdom&method=2&school=1" >/dev/null
echo "Prayer timings: OK"

curl -fsS "$BASE_URL/api/qibla/direction?lat=51.5072&lng=-0.1276" >/dev/null
echo "Qibla direction: OK"
