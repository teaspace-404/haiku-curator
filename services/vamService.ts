/**
 * Fetches a random artwork from the V&A Museum API and returns it as a base64 string.
 */
import type { ArtworkDetails } from '../types';

interface Artwork {
    base64Image: string;
    mimeType: string;
    title: string;
    details: ArtworkDetails;
}

const VAM_API_URL = 'https://api.vam.ac.uk/v2/objects/search?random=true&images=true&page_size=1';

const convertImageToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getRandomArtwork = async (): Promise<Artwork> => {
    try {
        // 1. Fetch random object metadata
        const objectResponse = await fetch(VAM_API_URL);
        if (!objectResponse.ok) {
            throw new Error('Failed to fetch artwork from the museum.');
        }
        const objectData = await objectResponse.json();

        if (!objectData.records || objectData.records.length === 0) {
            throw new Error('No artwork found in the museum response.');
        }

        const artworkRecord = objectData.records[0];

        // Log the full record for debugging purposes, as requested.
        console.log('V&A API Record:', artworkRecord);
        
        const imageId = artworkRecord._primaryImageId;
        const title = artworkRecord._primaryTitle || 'Untitled';
        
        // Corrected the field names based on the V&A API documentation for CSV/default fields.
        const details: ArtworkDetails = {
            artist: artworkRecord._primaryMaker__name || 'Unknown Artist',
            date: artworkRecord._primaryDate || 'Unknown Date',
            place: artworkRecord._primaryPlace || 'Unknown Place',
            objectType: artworkRecord.objectType || 'Unknown Type',
            systemNumber: artworkRecord.systemNumber || 'N/A',
        };

        if (!imageId) {
            // If the first random record has no image, recursively try again.
            return getRandomArtwork();
        }

        // 2. Construct the image URL
        // Using a reasonable size for display
        const imageUrl = `https://framemark.vam.ac.uk/collections/${imageId}/full/800,800/0/default.jpg`;
        
        // 3. Fetch the image itself
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error('Failed to fetch the artwork image.');
        }
        
        const imageBlob = await imageResponse.blob();
        
        // 4. Convert image blob to base64
        const base64Image = await convertImageToBase64(imageBlob);

        return {
            base64Image,
            mimeType: imageBlob.type,
            title,
            details,
        };

    } catch (error) {
        console.error("Error fetching from V&A Museum API:", error);
        throw new Error("Could not retrieve new artwork. Please try again.");
    }
};