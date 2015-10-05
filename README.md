# DownloadFileService
Deze service gaat een bestand ophalen op een meegegeven url en probeert dit dan op te slaan via het save-mechanisme van de browser.

Voor het opslaan worden enkelen methodes achter elkaar uitgeprobeerd omdat dit browser-afhankelijk is.

Als dit niet gelukt is of als er een fout optreedt, wordt dit doorgegeven aan de awelzijn-notificationservice.
