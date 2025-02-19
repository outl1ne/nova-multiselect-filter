# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.1] - 18-12-2024

### Changed

- Fixed case in latest Nova where last selection removal was not emitted
- Updated packages

## [5.0.0] - 18-12-2024

### Added

- Added Nova 5 support

## [4.0.8] - 24-07-2023

### Changed

- Improved .gitattributes to reduce vendor size

## [4.0.7] - 23-02-2023

### Changed

- Added check in `handleChange` to call `emitChanges` if `hasRemoved` is true, to ensure changes are emitted after a filter removal.

## [4.0.6] - 21-10-2022

### Changed

- Fixed group heading styles in dark mode

## [4.0.5] - 05-10-2022

### Changed

- Fixed crash when existing store doesn't contain filter

## [4.0.4] - 05-10-2022

### Changed

- Fixed single select not displaying selected value
- Fixed single select not closing after selecting an option
- Updated packages

## [4.0.3] - 05-09-2022

### Changed

- Allow overflowing in default Nova filter menu

## [4.0.2] - 01-09-2022

### Changed

- Fixed occasional issue with an empty value appearing as a selected option when searching for items

## [4.0.1] - 08-08-2022

### Changed

- Misc UI fixes
- Updated packages

## [4.0.0] - 29-04-2022

### Added

- Added Nova 4.0 support (huge thanks to [@dmason30](https://github.com/dmason30))

### Changed

- Dropped PHP 7.X support
- Renamed OptimistDig(i)tal namespace to Outl1ne
- Updated packages
