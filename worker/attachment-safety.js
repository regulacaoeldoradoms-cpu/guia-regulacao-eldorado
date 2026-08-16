'use strict';

const MAX_INSPECTION = 1024;

function startsWith(bytes, signature) {
  if (bytes.length < signature.length) return false;
  return signature.every((value, index) => bytes[index] === value);
}

function containsSignature(bytes, signature, maxOffset = MAX_INSPECTION) {
  const limit = Math.min(bytes.length - signature.length, maxOffset);
  for (let offset = 0; offset <= limit; offset += 1) {
    let matches = true;
    for (let index = 0; index < signature.length; index += 1) {
      if (bytes[offset + index] !== signature[index]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

export function detectAttachmentContentType(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || 0);
  if (startsWith(data, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (containsSignature(data, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf';
  return '';
}

export function extensionForAttachment(contentType) {
  if (contentType === 'image/jpeg') return 'jpg';
  if (contentType === 'image/png') return 'png';
  if (contentType === 'application/pdf') return 'pdf';
  return 'bin';
}

export async function validateAttachmentFile(file, maxBytes) {
  if (!(file instanceof File)) throw new Error('Selecione um arquivo.');
  if (!file.size) throw new Error('O arquivo enviado está vazio.');
  if (Number.isFinite(maxBytes) && file.size > maxBytes) throw new Error('ATTACHMENT_TOO_LARGE');

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const detected = detectAttachmentContentType(bytes);
  if (!detected) throw new Error('O arquivo não possui uma assinatura válida de JPG, PNG ou PDF.');
  if (file.type && file.type !== detected) {
    throw new Error('O tipo informado pelo arquivo não corresponde ao conteúdo real.');
  }

  return {
    buffer,
    contentType: detected,
    extension: extensionForAttachment(detected)
  };
}
