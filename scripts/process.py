"""
Convert raw survey results data into clean JavaScript file and variable.

Usage:
    process_data.py <input_file> <output_file>

Options:
    -h, --help  Show help screen.
    --version   Show version number.
"""

import csv

from docopt import docopt

from scripts.geocode import Geocode


def _write_csv(writer, row_data):
    """Write to CSV file."""
    writer.writerow(row_data)


def _process_row(writer, i, row):
    """Geocode and format this row."""
    # Assumes address is in 7th column.
    short_address = row[6]
    full_address = short_address + ', New Orleans, LA'

    print("Processing row {0}: {1}".format(i, short_address))

    # Assumes status is in 12th column.
    light_is_working = row[11].lower()[0]  # Yes/No/Partial => y/n/p

    geocoder = Geocode(full_address)
    row_data = [
        geocoder.lat,
        geocoder.lon,
        short_address,
        light_is_working]

    _write_csv(writer, row_data)


def _cli_has_errors(arguments):
    """Check for any CLI parsing errors."""
    in_file = arguments['<input_file>']
    out_file = arguments['<output_file>']

    single_argument = (
        (in_file is not None and out_file is None) or
        (in_file is None and out_file is not None))

    if single_argument:
        print("Must supply input and output files.")
        return True

    # All good
    return False


def convert_data(input_file, output_file):
    """Geocode and write out to data JS file."""
    with open(output_file, "w") as out_csv:
        writer = csv.writer(out_csv)
        writer.writerow([
            'lat',
            'lon',
            'short_address',
            'light_is_working'])

        with open(input_file, 'r') as raw_csv:
            reader = csv.reader(raw_csv)
            next(reader, None)  # Skip header row

            for i, row in enumerate(reader):
                _process_row(writer, i, row)


def cli(arguments):
    """Parse command-line arguments."""
    if _cli_has_errors(arguments):
        return

    input_file = arguments['<input_file>']
    output_file = arguments['<output_file>']

    convert_data(input_file, output_file)


if __name__ == '__main__':
    arguments = docopt(__doc__, version="0.0.1")
    cli(arguments)
