import { NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { RichTextDocument } from '@/components/RichTextRenderer';

// Helper function to convert plain text to Contentful Rich Text JSON
const convertPlainTextToRichText = (text: string): RichTextDocument => {
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {},
          },
        ],
      },
    ],
  };
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const programName = formData.get('programName') as string;
    const programInformationText = formData.get('programInformation') as string;
    const programImageFile = formData.get('programImage') as File | null;
    const programAssetsFiles = formData.getAll('programAssets') as File[];

    if (!programName || !programInformationText) {
      return NextResponse.json({ error: 'Program name and information are required.' }, { status: 400 });
    }

    const contentfulManagementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const contentfulSpaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID; // Assuming space ID is public
    const contentfulEnvironmentId = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || 'master'; // Assuming environment ID is public or master

    if (!contentfulManagementToken || !contentfulSpaceId) {
      return NextResponse.json({ error: 'Contentful API credentials not configured.' }, { status: 500 });
    }

    const client = createClient({
      accessToken: contentfulManagementToken,
    });

    const space = await client.getSpace(contentfulSpaceId);
    const environment = await space.getEnvironment(contentfulEnvironmentId);

    // Convert programInformation to Rich Text JSON
    const programInformationRichText = convertPlainTextToRichText(programInformationText);

    let programImageAssetId: string | undefined;
    if (programImageFile) {
      const imageArrayBuffer = await programImageFile.arrayBuffer();
      const imageAsset = await environment.createAssetFromFiles({
        fields: {
          title: {
            'en-US': programImageFile.name,
          },
          description: {
            'en-US': '',
          },
          file: {
            'en-US': {
              contentType: programImageFile.type,
              fileName: programImageFile.name,
              file: imageArrayBuffer,
            },
          },
        },
      });
      const processedImageAsset = await imageAsset.processForAllLocales();
      const publishedImageAsset = await processedImageAsset.publish();
      programImageAssetId = publishedImageAsset.sys.id;
    }

    const programAssetsAssetIds: string[] = [];
    for (const assetFile of programAssetsFiles) {
      const assetArrayBuffer = await assetFile.arrayBuffer();
      const asset = await environment.createAssetFromFiles({
        fields: {
          title: {
            'en-US': assetFile.name,
          },
          description: {
            'en-US': '',
          },
          file: {
            'en-US': {
              contentType: assetFile.type,
              fileName: assetFile.name,
              file: assetArrayBuffer,
            },
          },
        },
      });
      const processedAsset = await asset.processForAllLocales();
      const publishedAsset = await processedAsset.publish();
      programAssetsAssetIds.push(publishedAsset.sys.id);
    }

    const newEntry = await environment.createEntry('workoutProgram', {
      fields: {
        programName: {
          'en-US': programName,
        },
        programInformation: {
          'en-US': programInformationRichText,
        },
        ...(programImageAssetId && {
          programImage: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: programImageAssetId,
              },
            },
          },
        }),
        ...(programAssetsAssetIds.length > 0 && {
          programAssets: {
            'en-US': programAssetsAssetIds.map(assetId => ({
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: assetId,
              },
            })),
          },
        }),
      },
    });

    await newEntry.publish();

    return NextResponse.json({ message: 'Workout program added successfully!', entryId: newEntry.sys.id }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error adding workout program:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to add workout program.', details: errorMessage }, { status: 500 });
  }
}
