import ImageIO
import SwiftUI
import UIKit

/// Loads images from the app bundle (Resources/Images/...) with downsampled decoding
/// and an in-memory cache. All guide/community photos ship in the bundle — no network.
@MainActor
enum BundledImageStore {
    private static let cache = NSCache<NSString, UIImage>()

    static func url(for file: String) -> URL? {
        Bundle.main.resourceURL?.appendingPathComponent("AppResources/\(file)")
    }

    /// Decoded image downsampled to `maxPixel` on the long edge (ImageIO thumbnail).
    static func image(_ file: String, maxPixel: CGFloat = 900) -> UIImage? {
        let key = "\(file)#\(Int(maxPixel))" as NSString
        if let hit = cache.object(forKey: key) { return hit }
        guard let url = url(for: file),
              let source = CGImageSourceCreateWithURL(url as CFURL, nil)
        else { return nil }
        let options: [CFString: Any] = [
            kCGImageSourceThumbnailMaxPixelSize: maxPixel,
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
        ]
        guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else { return nil }
        let image = UIImage(cgImage: cgImage)
        cache.setObject(image, forKey: key)
        return image
    }
}

/// Displays a bundled photo by its JSON `file` path (e.g. "Images/guide/p12-0-X30.jpg").
struct BundledPhoto: View {
    let file: String
    /// Long-edge pixel cap for decode. Small for list thumbs, larger for galleries.
    var maxPixel: CGFloat = 900
    /// Crop to fill is a derivative — callers pass false for ND-licensed photos.
    var cropToFill: Bool = false

    var body: some View {
        if let uiImage = BundledImageStore.image(file, maxPixel: maxPixel) {
            Image(uiImage: uiImage)
                .resizable()
                .aspectRatio(contentMode: cropToFill ? .fill : .fit)
        } else {
            Rectangle()
                .fill(.quaternary)
                .aspectRatio(4 / 3, contentMode: .fit)
                .overlay {
                    Image(systemName: "photo")
                        .foregroundStyle(.secondary)
                }
        }
    }
}
