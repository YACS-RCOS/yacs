# Observer

## Overview
Observer is a service responsible for monitoring [Pipeline Sources](pipeline-sources), detecting changes over time, and transforming those changes into [Pipeline Events](pipeline-events).

Observer can 

### Polling
Observer works by polling a [Pipeline Adapter] on an interval. Observer then compares the data to the data from the last poll. Changes are extracted and transformed into [Pipeline Events](pipeline-events).

Observer includes retry logic with sensible defaults. All intervals and timings are easily changed [in the config](#configuration).

### Detecting Changes


## Configuration

## Events
```
  {
    "method": "post",
    "type": "listings",
    <!-- "luid": "CSCI-1200", -->
    "attrs": {
      "longname": "Data Structures"
    },
    "rel": {
      "course": { "shortname": "1200", "rel": { "subject": { "shortname": "CSCI" } } }
    }
  }
 // "suggest"?
        "course.shortname": "1200", "course.subject.shortname": "CSCI"

```
