import Foundation

// Photo credits, licence labels, source links and route-source labels.
// Everything here is derived from the bundled data: photos.json (credit, license,
// sourceUrl, page) and the Goodtime guidebook entry in info.json. Nothing is
// invented — a field the data doesn't carry is left out of the credit.

/// The Goodtime Adventures free guidebook PDF, the source of every image under
/// Images/guide/. Mirrors the info.json guidebook entry (title, author, "year" v1/14,
/// url); `AttributionTests` fails if the two drift apart.
enum GoodtimeGuide {
    static let title = "Koh Tao Rock Climbing & Bouldering Guide"
    static let publisher = "Goodtime Adventures"
    static let edition = "v1/14"
    static let pdfURLString = "http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf"
    static var pdfURL: URL? { URL(string: pdfURLString) }

    /// "Koh Tao Rock Climbing & Bouldering Guide by Goodtime Adventures (v1/14)"
    static var fullTitle: String { "\(title) by \(publisher) (\(edition))" }

    /// Viewer credit line; ", p.N" only when the page is known.
    static func creditLine(page: Int?) -> String {
        let base = "From \(fullTitle)"
        guard let page else { return base }
        return "\(base), p.\(page)"
    }
}

/// What the photo viewer shows under the caption: who made it, the licence, and
/// a tappable source link with a short human label.
struct PhotoCredit: Equatable, Sendable {
    let text: String
    let license: String?
    let link: URL?
    let linkLabel: String?
    let isGuide: Bool

    static func goodtime(page: Int?) -> PhotoCredit {
        PhotoCredit(text: GoodtimeGuide.creditLine(page: page),
                    license: nil,
                    link: GoodtimeGuide.pdfURL,
                    linkLabel: "Guidebook PDF (\(GoodtimeGuide.pdfURL.map(SourceHost.label(for:)) ?? "railay.com"))",
                    isGuide: true)
    }

    /// Credit for any bundled photo, or nil when the entry carries no credit data.
    static func forPhoto(_ photo: PhotoEntry) -> PhotoCredit? {
        if photo.isGuideImage {
            return goodtime(page: photo.guidePage)
        }
        let link = photo.sourceUrl.flatMap(URL.init(string:))
        guard photo.credit != nil || photo.license != nil || link != nil else { return nil }
        let license = photo.license.map(LicenseLabel.short)
        var text = ""
        if let credit = photo.credit {
            // No copyright sign on public-domain dedications.
            text = (license ?? "").hasPrefix("CC0") ? credit : "© \(credit)"
        }
        return PhotoCredit(text: text,
                           license: license,
                           link: link,
                           linkLabel: link.map(SourceHost.label(for:)),
                           isGuide: false)
    }
}

extension PhotoEntry {
    /// Images extracted from the Goodtime guidebook PDF live under Images/guide/.
    var isGuideImage: Bool { file.hasPrefix("Images/guide/") }

    /// PDF page of a guide image: the `page` field, else the `p{page}-` filename
    /// prefix (app/src/data/photos.ts: "the p{page} file prefix = PDF page number").
    var guidePage: Int? {
        guard isGuideImage else { return nil }
        if let page { return page }
        let name = (file as NSString).lastPathComponent
        guard name.hasPrefix("p") else { return nil }
        let digits = name.dropFirst().prefix { $0.isNumber }
        return Int(digits)
    }
}

enum LicenseLabel {
    /// photos.json spells the non-CC case out ("user-contributed, all rights reserved —
    /// shown with attribution and source link"); the viewer only needs the licence.
    static func short(_ raw: String) -> String {
        raw.localizedCaseInsensitiveContains("all rights reserved") ? "All rights reserved" : raw
    }
}

enum SourceHost {
    private static let names: [String: String] = [
        "mountainproject.com": "Mountain Project",
        "flickr.com": "Flickr",
        "commons.wikimedia.org": "Wikimedia Commons",
        "rakkup.com": "Rakkup",
        "mapotapo.com": "Mapo Tapo",
        "rockrun.com": "Rock+Run",
        "tumblr.com": "Tumblr",
        "thecrag.com": "theCrag",
        "27crags.com": "27crags",
    ]

    /// Short human label for a link's site: a known name, else the bare host.
    static func label(for url: URL) -> String {
        guard var host = url.host()?.lowercased() else { return url.absoluteString }
        if host.hasPrefix("www.") { host.removeFirst(4) }
        if let name = names[host] { return name }
        // Subdomains of a known site (onsightkohtaoclimbing-blog.tumblr.com).
        if let match = names.first(where: { host.hasSuffix("." + $0.key) }) { return match.value }
        return host
    }
}

/// Plain-words labels for RouteRecord.source. Raw values in routes.json:
/// guidebook, 27crags, mountainproject, vault (routes.ts also types these four).
enum RouteSourceLabel {
    static func label(for raw: String) -> String {
        switch raw {
        case "guidebook": "Goodtime Adventures guidebook (PDF)"
        case "27crags": "27crags / The Topo"
        case "mountainproject": "Mountain Project"
        case "thecrag": "theCrag"
        // The web app's label for the research-vault source (app/src/lib/photo.ts).
        case "vault": "Vault note"
        default: raw
        }
    }
}

// MARK: - Photo credits list (Sources screen)

/// One photographer/author inside a source site, with the licence and links of their photos.
struct PhotoCreditAuthor: Identifiable, Hashable, Sendable {
    var id: String { "\(credit)|\(license)" }
    let credit: String
    let license: String
    let photoCount: Int
    /// Distinct source links, in photos.json order.
    let links: [URL]
}

/// A source site (Mountain Project, Flickr …) and the authors credited from it.
struct PhotoCreditSource: Identifiable, Hashable, Sendable {
    var id: String { name }
    let name: String
    let authors: [PhotoCreditAuthor]
    var photoCount: Int { authors.reduce(0) { $0 + $1.photoCount } }
}

enum PhotoCredits {
    /// Groups non-guide photos by source site, then author and licence. Built from
    /// photos.json at runtime so the list can't drift from what ships.
    static func sources(from photos: [PhotoEntry]) -> [PhotoCreditSource] {
        struct Key: Hashable { let site: String; let credit: String; let license: String }
        var order: [Key] = []
        var counts: [Key: Int] = [:]
        var links: [Key: [URL]] = [:]
        for photo in photos where !photo.isGuideImage {
            let url = photo.sourceUrl.flatMap(URL.init(string:))
            let key = Key(site: url.map(SourceHost.label(for:)) ?? "Other",
                          credit: photo.credit ?? "Unknown",
                          license: photo.license.map(LicenseLabel.short) ?? "Licence not recorded")
            if counts[key] == nil { order.append(key) }
            counts[key, default: 0] += 1
            if let url, !(links[key] ?? []).contains(url) { links[key, default: []].append(url) }
        }
        let bySite = Dictionary(grouping: order, by: \.site)
        return bySite.map { site, keys in
            PhotoCreditSource(name: site, authors: keys.map {
                PhotoCreditAuthor(credit: $0.credit, license: $0.license,
                                  photoCount: counts[$0] ?? 0, links: links[$0] ?? [])
            }.sorted { $0.credit.localizedCaseInsensitiveCompare($1.credit) == .orderedAscending })
        }
        .sorted { $0.photoCount != $1.photoCount ? $0.photoCount > $1.photoCount : $0.name < $1.name }
    }
}
