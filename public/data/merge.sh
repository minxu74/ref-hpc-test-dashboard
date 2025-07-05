#!/usr/bin/env bash

jq -n --slurpfile file1 ref_prov_2025-05-31/ref_prov.json  \
      --slurpfile file2 ref_prov_2025-06-11/ref_prov.json  \
   '{"perlmutter": ($file1[0].perlmutter + $file2[0].perlmutter)}' > ref_prov_all.json
