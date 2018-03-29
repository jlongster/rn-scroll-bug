//
//  CachedImageManager.swift
//  Blink
//
//  Created by Sam Mueller on 8/17/17.
//  Copyright © 2017 Blink. All rights reserved.
//

@objc(CachedImageManager)
class CachedImageManager : RCTViewManager {
    
    override func view() -> UIView! {
        let image = CachedImageView(frame: CGRect.zero)
        return image
    }
}
