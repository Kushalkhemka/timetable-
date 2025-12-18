import { supabase } from 'src/lib/supabaseClient';

export type CurriculumFile = {
  name: string;
  path: string;
  size: number | null;
  updatedAt: string | null;
  url: string; // public or signed URL
  contentType: string | null;
};

const BUCKET = 'curriculum';

function isPublicBucket(): boolean {
  // Heuristic: if public URL resolves and no error, we treat as public.
  // We can't query bucket policy from client; we'll optimistically try public first.
  return true;
}

export async function getFileUrl(path: string): Promise<string> {
  if (isPublicBucket()) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    if (data?.publicUrl) return data.publicUrl;
  }
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
  if (error || !data?.signedUrl) {
    // Fallback to public URL even if it might not work
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  return data.signedUrl;
}

export async function listCurriculumFiles(prefix = ''): Promise<CurriculumFile[]> {
  const folder = prefix.replace(/^\/+|\/+$/g, '');
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit: 1000,
    sortBy: { column: 'updated_at', order: 'desc' },
  });
  if (error || !data) return [];

  const files = data.filter((e) => e.id && !e.name.endsWith('/'));
  const out: CurriculumFile[] = await Promise.all(
    files.map(async (f) => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      const url = await getFileUrl(path);
      // Try to infer content type by extension; Storage list does not include contentType
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const contentType =
        ext === 'pdf'
          ? 'application/pdf'
          : ext === 'doc' || ext === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : ext === 'ppt' || ext === 'pptx'
          ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          : null;
      return {
        name: f.name,
        path,
        size: (f as any).metadata?.size ?? null,
        updatedAt: (f as any).updated_at ?? null,
        url,
        contentType,
      };
    })
  );
  return out;
}


