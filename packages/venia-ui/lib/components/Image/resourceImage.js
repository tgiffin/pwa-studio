import React from 'react';
import { array, func, number, oneOfType, string } from 'prop-types';
import { resourceUrl } from '@magento/venia-drivers';
import { useResourceImage } from '@magento/peregrine/lib/talons/Image/useResourceImage';

import { generateSrcset } from '../../util/images';

/**
 * Renders a Magento resource image.
 *
 * @param {string}   props.alt the alt attribute to apply to the image.
 * @param {string}   props.className the class to apply to this image.
 * @param {Func}     props.handleError the function to call if the image fails to load.
 * @param {Func}     props.handleLoad the function to call if the image successfully loads.
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {number}   props.resourceHeight the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {array}    props.widthBreakpoints breakpoints related to widths.
 * @param {array}    props.widths image widths used by the browser to select the image source.
 */
const ResourceImage = props => {
    const {
        alt,
        className,
        handleError,
        handleLoad,
        resource,
        resourceHeight,
        type,
        width,
        widthBreakpoints,
        widths,
        ...rest
    } = props;

    const talonProps = useResourceImage({
        generateSrcset,
        resource,
        resourceHeight,
        resourceUrl,
        type,
        width,
        widthBreakpoints,
        widths
    });

    const { sizes, src, srcSet } = talonProps;

    // Note: Attributes that are allowed to be overridden must appear before the spread of `rest`.
    return (
        <img
            loading="lazy"
            {...rest}
            alt={alt}
            className={className}
            height={resourceHeight}
            onError={handleError}
            onLoad={handleLoad}
            sizes={sizes}
            src={src}
            srcSet={srcSet}
            width={width}
        />
    );
};

ResourceImage.propTypes = {
    alt: string.isRequired,
    className: string,
    handleError: func,
    handleLoad: func,
    resource: string.isRequired,
    resourceHeight: number,
    type: string,
    width: oneOfType([number, string]),
    widthBreakpoints: array,
    widths: array,
};

ResourceImage.defaultProps = {
    widthBreakpoints: [],
    type: 'image-product'
};

export default ResourceImage;
