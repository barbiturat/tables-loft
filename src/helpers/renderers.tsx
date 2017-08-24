import * as React from 'react';
import {
  ErrorsProps,
  WrapperProps,
  CustomComponentProps
} from 'react-redux-form';
import * as R from 'ramda';

export const renderErrorsBlock: React.StatelessComponent<
  ErrorsProps & WrapperProps
> = props =>
  <div className="form-errors">
    {props.children}
  </div>;

export const renderErrorComponent: React.StatelessComponent<
  ErrorsProps & CustomComponentProps
> = props =>
  <div className="error">
    {props.children}
  </div>;

export interface DrawComponent<
  TComp extends React.ComponentType<TProps>,
  TProps extends {}
> extends R.CurriedFunction2<TComp, TProps, JSX.Element> {}

export interface DrawListComponent<
  TComp extends React.ComponentType<TProps>,
  TProps extends {}
> extends R.CurriedFunction3<TComp, TProps, number, JSX.Element> {}

/*export function drawComponent<TComp extends React.StatelessComponent<TProps>, TProps extends {}>(Comp: TComp, props?: TProps) {
  return R.curry<TComp, TProps, JSX.Element>((Cmp: TComp, pr: TProps) => <Cmp {...pr} />)(Comp, props as TProps);
}*/

export const drawComponent: DrawComponent<
  React.ComponentType,
  {}
> = R.curry((Comp, props) => <Comp {...props} />);

export const drawListComponent: DrawListComponent<
  React.ComponentType<{}>,
  {}
> = R.curry((Comp: React.ComponentType<{}>, props: {}, key: number) =>
  <Comp key={key} {...props} />
);
