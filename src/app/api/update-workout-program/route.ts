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

interface AssetLink {
  sys: {
    type: string;
    linkType: string;
    id: string;
  };
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();

    const programId = formData.get('programId') as string;
    const programName = formData.get('programName') as string;
    const difficulty = formData.get('difficulty') as string;
    const level = formData.get('level') as string;
    const duration = formData.get('duration') as string;
    const programInformationText = formData.get('programInformation') as string;
    const programImageFile = formData.get('programImage') as File | null;
    const programAssetsFiles = formData.getAll('programAssets') as File[];

    if (!programId || !programName || !programInformationText || !programImageFile) {
      return NextResponse.json({ error: 'Program ID, name, information and image are required.' }, { status: 400 });
    }

    const contentfulManagementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const contentfulSpaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    const contentfulEnvironmentId = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || 'master';

    if (!contentfulManagementToken || !contentfulSpaceId) {
      return NextResponse.json({ error: 'Contentful API credentials not configured.' }, { status: 500 });
    }

    const client = createClient({
      accessToken: contentfulManagementToken,
    });

    const space = await client.getSpace(contentfulSpaceId);
    const environment = await space.getEnvironment(contentfulEnvironmentId);

    const entry = await environment.getEntry(programId);

    // Update programName
    entry.fields.programName['en-US'] = programName;

    // Update programInformation
    entry.fields.programInformation['en-US'] = convertPlainTextToRichText(programInformationText);

    entry.fields.difficulty['en-US'] = difficulty;
    entry.fields.level['en-US'] = level;
    entry.fields.duration['en-US'] = Number(duration);

    // Handle programImage update
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
      entry.fields.programImage = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: publishedImageAsset.sys.id,
          },
        },
      };
    }

    // Handle programAssets update
    if (programAssetsFiles && programAssetsFiles.length > 0) {
      const newAssetLinks: AssetLink[] = [];
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
        newAssetLinks.push({
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: publishedAsset.sys.id,
          },
        });
      }
      entry.fields.programAssets = { 'en-US': newAssetLinks };
    } else if (programAssetsFiles && programAssetsFiles.length === 0) {
      // If no files are provided, clear the assets
      entry.fields.programAssets = { 'en-US': [] };
    }

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json({ message: 'Workout program updated successfully!', entryId: updatedEntry.sys.id }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating workout program:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to update workout program.', details: errorMessage }, { status: 500 });
  }
}
