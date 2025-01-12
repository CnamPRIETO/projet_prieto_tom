#!/bin/bash

# Nom du fichier de sortie
fichier_sortie="fichiers_combines.txt"

# Vider le fichier de sortie s'il existe déjà
> "$fichier_sortie"

# Trouver tous les fichiers .cpp et .h et les traiter
find . -type f \( -name "*.ts" -o -name "*.html" -o -name "*.json" \) | while read fichier; do
    echo "===== $fichier =====" >> "$fichier_sortie"
    cat "$fichier" >> "$fichier_sortie"
    echo -e "\n" >> "$fichier_sortie"
done
