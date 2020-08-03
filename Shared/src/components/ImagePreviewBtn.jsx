import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Button, Pagination} from 'antd';
import {formatMessage} from '../localizations/intl';
import qs from 'qs';

const style = {
    float: 'left'
};
const clear = {
    clear: 'both'
};
const imageReg = new RegExp(/\.(gif|png|jpg|jpeg|bmp|svg|tif)$/i);
const SIZE = 50;

export const checkIsImage = file => imageReg.test(file.fileName)
export const getImagesFromFiles = files => files.filter(checkIsImage)

class ImagePreviewBtn extends PureComponent {
    state = {
        pageIndex: 0
    };

    onChange = page => {
        this.setState({
            pageIndex: page - 1,
        });
    };

    render() {
        const pageIndex = this.state.pageIndex;
        const images = getImagesFromFiles(this.props.images || []);

        if(images.length === 0) return null;
        const queryString = qs.stringify({
            i: images
                .slice(pageIndex * SIZE, (pageIndex * SIZE) + SIZE)
                .map(file => `${file.fileId}:${file.fileName}`)
        });
        const url = `/imagePreview?${queryString}`;
        return (
            <div style={clear}>
                <div style={style}>
                    <Pagination
                        size="small"
                        hideOnSinglePage={true}
                        current={pageIndex + 1}
                        total={images.length}
                        pageSize={SIZE}
                        onChange={this.onChange}
                        showTotal={total =>
                            formatMessage(
                                {
                                    id: 'imagePreviewBtn.showTableTotal',
                                    defaultMessage: '共 {total} 张图片'
                                },
                                {total}
                            )}/>
                </div>
                <div style={style}>
                    <Button size="small" href={url} target="_blank">
                        {this.props.btnText ||
                            formatMessage({
                                id: 'btn.imagePreview',
                                defaultMessage: '图片预览'
                            })}
                    </Button>
                </div>
            </div>
        );
    }
}

ImagePreviewBtn.propTypes = {
    /** 按钮文本 */
    btnText: PropTypes.string,
    /** 图像数组 */
    images: PropTypes.array
};

export default ImagePreviewBtn;
