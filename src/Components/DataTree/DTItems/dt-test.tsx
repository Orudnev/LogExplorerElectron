import { useMemo,useState,useEffect } from 'react';
import { TreeItem } from 'react-complex-tree';
import { ITreeItemData } from '../../test-tree';

export function DtTest(props:TreeItem<ITreeItemData>){
    return(<div>{props.index}</div>);
}