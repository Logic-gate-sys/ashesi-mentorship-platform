import { uploadFile } from '#utils-types/utils/upload';

export async function uploadMedia(media: File): Promise<string | null> {
	try {
		return await uploadFile(media, {
			folder: 'mentor-app/headshots',
			resource_type: 'image',
			tags: ['avatar', 'professional-headshot'],
		});
	} catch {
		return null;
	}
}