
## Setup

Create a virtual environment.

```bash
mkvirtualenv --python=`which python3` school-zones
```

Make sure your virtual environment is activated.

```bash
workon school-zones
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Configure environment variables. You can store these in `~/.virtualenvs/postactivate`, `~/.virtualenvs/school-zones/bin/postactivate`, `~/.env` or anywhere else in your PATH.

```bash
# Amazon Web Services
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=

# Google Geocoding service
export GOOGLE_GEOCODING_API_KEY=
```

## Data conversion

Download the survey results as a CSV file from Google Sheets. Save to `data/results.csv`.

In the top-level directory, run Make to convert `data/results.csv` to `www/markers.json`. This might require some fine tuning to `scripts/process.py`, depending on how `data/results.csv` is formatted.

```bash
make
```

## Development

While designing the map, run a local server to preview your changes.

```bash
# Python 2
python -m SimpleHTTPServer

# Python 3
python -m http.server
```

Open a new tab in your web browser and navigate to [http://localhost:8000](http://localhost:8000).

## Deployment

Run `scripts/s3.sh` to upload the contents in `www/` to an S3 bucket. Make sure to edit `scripts/s3.sh` first and update the new bucket name.

```bash
./scripts/s3.sh
```

## Publication

Use an iframe to post the map within an article.

```html
<iframe src="http://projects.thelensnola.org/school-zones/PROJECT_SLUG/map.html" frameborder="0">
```
