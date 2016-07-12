#!/bin/perl
=pod
make_js.pl in.js out.js
如果没有包装，则加包装；否则去包装

=cut

$PLUGIN = 'cordova-plugin-videoproc';

$f = $ARGV[0] or die '*** require js file';
$f2 = $ARGV[1] or die '*** require js out file';

if (! $f =~ /(\w+)\.js$/)
{
	die "*** bad file $f\n";
}
$base = $1;

undef $/;
open IN, $f;
$_ = <>;
close IN;
if (/^cordova\.define/) {
	s/^.*?\{ //s;
	s/\s*\}\);\s*$//s;
}
else {
	$_ = "cordova.define(\"${PLUGIN}.${base}\", function(require, exports, module) { " . $_ . "\n});\n";
}
open OUT, ">", $f2;
print OUT $_;
close OUT;
