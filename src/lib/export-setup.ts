import { formatPrice, selectedProducts, totalFor, type Setup } from './catalog';

/**
 * Export a self-contained visual summary of the current, user-built setup.
 * The stage is native SVG; it can be rendered to canvas without third-party
 * image hosts, screenshot services or private data collection.
 */
export async function downloadSetupCard(stage: SVGSVGElement, setup: Setup): Promise<void> {
  const clone = stage.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '900');
  clone.setAttribute('height', '630');
  clone.setAttribute('viewBox', '0 0 900 630');

  const markup = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not render the workspace illustration.'));
      image.src = svgUrl;
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1500;
  canvas.height = 1160;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser does not support canvas export.');

  ctx.fillStyle = '#f3f7f8';
  ctx.fillRect(0, 0, 1500, 1160);
  ctx.fillStyle = '#fff';
  ctx.fillRect(52, 45, 1396, 1070);
  ctx.fillStyle = '#172126';
  ctx.fillRect(52, 45, 1396, 138);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 47px Arial, sans-serif';
  ctx.fillText('workspace builder', 108, 128);
  ctx.fillStyle = '#9dc8e2';
  ctx.font = 'bold 19px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('MY BALI WORKSPACE', 1394, 123);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#eff3f5';
  ctx.fillRect(108, 226, 1284, 693);
  ctx.drawImage(image, 108, 226, 1284, 693);

  ctx.fillStyle = '#172126';
  ctx.font = 'bold 35px Arial, sans-serif';
  ctx.fillText('Your setup, your way.', 109, 979);
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${formatPrice(totalFor(setup))} / ${setup.plan}`, 1390, 979);
  ctx.textAlign = 'left';

  const names = selectedProducts(setup).map((product) => product.name);
  const summary = names.join('  ·  ');
  ctx.fillStyle = '#586d78';
  ctx.font = '21px Arial, sans-serif';
  const maxWidth = 1260;
  let result = summary;
  while (ctx.measureText(result).width > maxWidth && result.length > 5) result = result.slice(0, -2);
  if (result.length < summary.length) result = result.trimEnd() + '…';
  ctx.fillText(result, 109, 1027);

  ctx.fillStyle = '#8898a0';
  ctx.font = '17px Arial, sans-serif';
  ctx.fillText('Independent design concept · Illustrative prices · No orders or payments taken', 109, 1080);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((output) => output ? resolve(output) : reject(new Error('Could not create the image.')), 'image/png');
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'my-bali-workspace.png';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 3000);
}
