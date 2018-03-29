import UIKit
import AVFoundation
import Nuke

class CachedImageView: UIImageView {
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        contentMode = .scaleAspectFill
        clipsToBounds = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    @IBInspectable
    public var source: String = "" {
        didSet {
            Nuke.loadImage(with: URL(string: source)!, into: self)
        }
    }
}
