export default function ReceiptPreview({ image, merchant, confidence }: { image?: string; merchant: string; confidence: number }) {
  return (
    <div className="panel overflow-hidden">
      {image ? <img alt={merchant} className="h-56 w-full object-cover" src={image} /> : <div className="h-56 bg-muted" />}
      <div className="p-5">
        <h3 className="section-title">{merchant}</h3>
        <p className="subtle-text">OCR confidence {confidence}%</p>
      </div>
    </div>
  );
}
