import { NextResponse } from 'next/server';
import { createClient } from 'contentful-management';

export async function DELETE(request: Request) {
  try {
    const { programId } = await request.json();

    if (!programId) {
      return NextResponse.json({ error: 'Program ID is required.' }, { status: 400 });
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

    // Unpublish and then delete the entry
    await entry.unpublish();
    await entry.delete();

    return NextResponse.json({ message: 'Workout program deleted successfully!' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting workout program:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to delete workout program.', details: errorMessage }, { status: 500 });
  }
}
