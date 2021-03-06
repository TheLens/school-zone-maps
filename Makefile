.DEFAULT_GOAL := all

.PHONY: all deploy

data/geocoded.csv: data/results.csv
	@# Convert raw results data to geocoded data stored as CSV.
	@mkdir -p $(dir $@)
	@python scripts/process.py $< $@

www/markers.json: data/geocoded.csv
	@# Convert geocoded data to GeoJSON
	@csvjson \
		--lat lat \
		--lon lon \
		$< > $@

all: www/markers.json

deploy:
	@bash scripts/s3.sh
